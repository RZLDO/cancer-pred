import vision from '@google-cloud/vision';
import { extractAddressAdvanced } from './extractAddress.mjs';
import { extractNameAdvanced } from './extractName.mjs';

const client = new vision.ImageAnnotatorClient({
    keyFilename: './credential/google-vision.json'
});

async function runOCR(imagePath) {
    try {
        const [result] = await client.documentTextDetection(imagePath);
        const fullText = result.fullTextAnnotation?.text;
        
        console.log('=== RAW OCR TEXT ===');
        console.log(fullText);
        console.log('\n=== CLEANING & PROCESSING ===');
        
        const cleanedData = parseKTPFromOCR(fullText);
        console.log('\n=== FINAL RESULT ===');
        console.log(JSON.stringify(cleanedData, null, 2));
        return JSON.stringify(cleanedData, null, 2);
    } catch (error) {
        console.error("OCR Error:", error.message);
    }
}

function parseKTPFromOCR(text) {
    if (!text) return {};
    
    // Step 1: Clean raw text
    const cleanedText = cleanRawText(text);
    console.log('Cleaned text:', cleanedText);
    
    // Step 2: Multiple parsing strategies
    const strategies = [
        parseByStructuredLayout,
        parseByKeywordProximity, 
        parseByPatternMatching,
        parseByPositionalGuess
    ];
    
    let bestResult = {};
    let maxScore = 0;
    
    // Try each strategy and pick the best one
    for (const strategy of strategies) {
        try {
            const result = strategy(cleanedText);
            const score = calculateDataCompleteness(result);
            
            console.log(`Strategy ${strategy.name}: score ${score}`, result);
            
            if (score > maxScore) {
                maxScore = score;
                bestResult = result;
            }
        } catch (error) {
            console.log(`Strategy ${strategy.name} failed:`, error.message);
        }
    }
    
    // Step 3: Post-process and validate
    return validateAndCleanResult(bestResult);
}

function cleanRawText(text) {
    return text
        .replace(/\s+/g, ' ')  // Multiple spaces to single space
        .replace(/[^\w\s:\/\-,\.]/g, '')  // Remove weird characters except common punctuation
        .replace(/(\d)\s+(\d)/g, '$1$2')  // Remove spaces between digits (for NIK)
        .replace(/:\s*\n/g, ': ')  // Clean up colon formatting
        .trim();
}

function parseByStructuredLayout(text) {
    console.log('Trying structured layout parsing...');
    
    const data = {};
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    
    // Enhanced name extraction for structured layout
    data.nama = extractNameFromStructured(lines);
    data.alamat = extractAddressAdvanced(lines)
    
    // Look for colon-separated values (original approach)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes(':')) {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();
            const cleanKey = key.trim().toUpperCase();
            
            if (cleanKey.includes('NIK') && !data.nik) {
                data.nik = extractNIK(value) || extractNIK(lines[i + 1] || '');
            }
            else if (cleanKey.includes('NAMA') && !cleanKey.includes('AYAH') && !cleanKey.includes('IBU') && !data.nama) {
                data.nama = value || lines[i + 1]?.trim();
            }
            else if (cleanKey.includes('TEMPAT') || cleanKey.includes('LAHIR')) {
                const birthData = parseBirthInfo(value || lines[i + 1]?.trim());
                data.tempat_lahir = birthData.tempat;
                data.tanggal_lahir = birthData.tanggal;
            }
            else if (cleanKey.includes('JENIS') && cleanKey.includes('KELAMIN')) {
                data.jenis_kelamin = value || lines[i + 1]?.trim();
            }
            else if (cleanKey.includes('ALAMAT')) {
                data.alamat = value || lines[i + 1]?.trim();
            }
        }
    }
    
    return data;
}

function parseByKeywordProximity(text,) {
    console.log('Trying keyword proximity parsing...');
    
    const data = {};
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const words = text.split(/\s+/);
    
    // Enhanced name extraction
    data.nama = extractNameAdvanced(text, lines);
    data.alamat = extractAddressAdvanced(text, lines); 
 
    
    // Find keywords and extract nearby values
    const keywords = {
        'NIK': ['nik'],
        'TEMPAT': ['tempat', 'lahir', 'tgl'],
        'KELAMIN': ['jenis', 'kelamin', 'jns'],
        'ALAMAT': ['alamat', 'jalan', 'jl'],
        'AGAMA': ['agama'],
        'KAWIN': ['kawin', 'status', 'perkawinan'],
        'PEKERJAAN': ['pekerjaan', 'kerja'],
        'KEWARGANEGARAAN': ['kewarganegaraan', 'wni', 'wna']
    };
    
    for (const [field, searchTerms] of Object.entries(keywords)) {
        for (let i = 0; i < words.length; i++) {
            const word = words[i].toLowerCase();
            
            if (searchTerms.some(term => word.includes(term))) {
                // Look for value in next few words
                const nextWords = words.slice(i + 1, i + 6).join(' ');
                
                if (field === 'NIK') {
                    const nik = extractNIK(nextWords);
                    if (nik) data.nik = nik;
                }
                else if (field === 'TEMPAT' && !data.tempat_lahir) {
                    const birthData = parseBirthInfo(nextWords);
                    data.tempat_lahir = birthData.tempat;
                    data.tanggal_lahir = birthData.tanggal;
                }
                // Add more field extractions...
                
                break;
            }
        }
    }
    
    return data;
}

function parseByPatternMatching(text) {
    console.log('Trying pattern matching...');
    const data = {};
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean); 
    // Enhanced name extraction
    data.nama = extractNameAdvanced(text, lines);
    data.alamat = extractAddressAdvanced(text, lines )
    console.log(data.alamat)
    
    // NIK: exactly 16 digits
    const nikMatch = text.match(/\b\d{16}\b/);
    if (nikMatch) data.nik = nikMatch[0];
    
    // Date patterns for birth date
    const datePatterns = [
        /(\d{1,2})[\/\-\s](\d{1,2})[\/\-\s](\d{4})/,
        /(\d{1,2})\s*(JANUARI|FEBRUARI|MARET|APRIL|MEI|JUNI|JULI|AGUSTUS|SEPTEMBER|OKTOBER|NOVEMBER|DESEMBER)\s*(\d{4})/i,
        /(\d{1,2})\s*(JAN|FEB|MAR|APR|MEI|JUN|JUL|AGU|SEP|OKT|NOV|DES)\s*(\d{4})/i
    ];
    
    for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match && !data.tanggal_lahir) {
            data.tanggal_lahir = match[0];
            
            // Try to find place name before the date
            const beforeDate = text.substring(0, match.index).split(/\s+/).slice(-3).join(' ');
            const placeMatch = beforeDate.match(/([A-Z][A-Z\s]+)$/);
            if (placeMatch) {
                data.tempat_lahir = placeMatch[1].trim();
            }
            break;
        }
    }
    
    // Gender patterns
    const genderMatch = text.match(/\b(LAKI-LAKI|PEREMPUAN|L|P)\b/i);
    if (genderMatch) data.jenis_kelamin = genderMatch[0];
    
    // Religion patterns
    const religionMatch = text.match(/\b(ISLAM|KRISTEN|KATOLIK|HINDU|BUDDHA|KHONGHUCU)\b/i);
    if (religionMatch) data.agama = religionMatch[0];
    
    return data;
}

function parseByPositionalGuess(text) {
    console.log('Trying positional guessing...');
    
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const data = {};
    
    // Common KTP layout: NIK usually in first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const nik = extractNIK(lines[i]);
        if (nik) {
            data.nik = nik;
            break;
        }
    }
    
    // Name usually follows NIK
    if (data.nik) {
        const nikLineIndex = lines.findIndex(line => line.includes(data.nik));
        if (nikLineIndex >= 0 && nikLineIndex + 1 < lines.length) {
            const potentialName = lines[nikLineIndex + 1];
            if (isValidName(potentialName)) {
                data.nama = potentialName;
            }
        }
    }
    
    return data;
}



// Helper functions
function extractNIK(text) {
    if (!text) return null;
    const match = text.match(/\b\d{16}\b/);
    return match ? match[0] : null;
}

function isValidName(text) {
    if (!text || text.length < 2) return false;
    
    // Name should contain mostly letters and spaces
    const cleanText = text.trim();
    
    // Check basic pattern
    if (!/^[A-Za-z\s.']+$/.test(cleanText)) return false;
    
    // Should have at least 2 words for Indonesian names
    const words = cleanText.split(/\s+/);
    if (words.length < 1) return false;
    
    // Each word should be reasonable length
    const validWords = words.filter(word => word.length >= 2 && word.length <= 20);
    if (validWords.length === 0) return false;
    
    // Total length check
    if (cleanText.length > 50) return false;
    
    // Should not be all numbers
    if (/^\d+$/.test(cleanText)) return false;
    
    // Should not contain common non-name keywords
    const nonNameWords = ['REPUBLIK', 'INDONESIA', 'ELEKTRONIK', 'BERLAKU', 'SELAMANYA'];
    if (nonNameWords.some(word => cleanText.toUpperCase().includes(word))) return false;
    
    return true;
}

function cleanName(name) {
    if (!name) return '';
    
    return name
        .replace(/[^\w\s.']/g, '') // Remove special chars except dots and apostrophes
        .replace(/\s+/g, ' ') // Multiple spaces to single
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Title case
        .join(' ');
}

function parseBirthInfo(birthInfo) {
    if (!birthInfo) return { tempat: '', tanggal: '' };
    
    const datePatterns = [
        /(\d{1,2})[\/\-\s](\d{1,2})[\/\-\s](\d{4})/,
        /(\d{1,2})\s*(JANUARI|FEBRUARI|MARET|APRIL|MEI|JUNI|JULI|AGUSTUS|SEPTEMBER|OKTOBER|NOVEMBER|DESEMBER)\s*(\d{4})/i
    ];

    let tempat = '';
    let tanggal = '';

    for (const pattern of datePatterns) {
        const match = birthInfo.match(pattern);
        if (match) {
            tanggal = match[0];
            tempat = birthInfo.replace(match[0], '').replace(/,/g, '').trim();
            break;
        }
    }

    if (!tanggal && birthInfo.includes(',')) {
        const parts = birthInfo.split(',');
        if (parts.length >= 2) {
            tempat = parts[0].trim();
            tanggal = parts[1].trim();
        }
    }

    return {
        tempat: tempat || birthInfo,
        tanggal: tanggal
    };
}

function calculateDataCompleteness(data) {
    const requiredFields = ['nik', 'nama', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin','alamat'];
    const optionalFields = ['agama', 'status_perkawinan', 'pekerjaan'];
    
    let score = 0;
    
    // Required fields worth more points
    requiredFields.forEach(field => {
        if (data[field] && data[field].length > 0) {
            score += 20;
        }
    });
    
    // Optional fields
    optionalFields.forEach(field => {
        if (data[field] && data[field].length > 0) {
            score += 5;
        }
    });
    
    // Bonus for valid NIK
    if (data.nik && /^\d{16}$/.test(data.nik)) {
        score += 10;
    }
    
    return score;
}

function validateAndCleanResult(data) {
    const cleaned = {};
    
    // Validate and clean each field
    if (data.nik && /^\d{16}$/.test(data.nik)) {
        cleaned.nik = data.nik;
    }
    
    if (data.nama && isValidName(data.nama)) {
        cleaned.nama = cleanName(data.nama);
    }
    
    ['tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'alamat', 'agama', 'status_perkawinan', 'pekerjaan', 'kewarganegaraan'].forEach(field => {
        if (data[field] && typeof data[field] === 'string' && data[field].trim().length > 0) {
            cleaned[field] = data[field].trim();
        }
    });
    
    return cleaned;
}

function getValueFromLine(line) {
    const parts = line.split(':');
    return parts.length > 1 ? parts.slice(1).join(':').trim() : '';
}

// Export functions
export { parseKTPFromOCR, runOCR };