function extractNameAdvanced(text, lines) {
    console.log('Advanced name extraction...');
    
    // Strategy 1: Look for NAMA keyword with various patterns
    const nameFromKeyword = extractNameByKeyword(text, lines);
    if (nameFromKeyword) {
        console.log('Found name by keyword:', nameFromKeyword);
        return nameFromKeyword;
    }
    
    // Strategy 2: Positional - usually after NIK
    const nameFromPosition = extractNameByPosition(text, lines);
    if (nameFromPosition) {
        console.log('Found name by position:', nameFromPosition);
        return nameFromPosition;
    }
    
    // Strategy 3: Pattern matching - find likely name patterns
    const nameFromPattern = extractNameByPattern(text, lines);
    if (nameFromPattern) {
        console.log('Found name by pattern:', nameFromPattern);
        return nameFromPattern;
    }
    
    console.log('No name found with advanced extraction');
    return null;
}

function extractNameFromStructured(lines) {
    // Look for NAMA in structured format
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toUpperCase();
        
        if (line.includes('NAMA') && !line.includes('AYAH') && !line.includes('IBU')) {
            // Check if there's a colon separator
            if (lines[i].includes(':')) {
                const namePart = lines[i].split(':')[1]?.trim();
                if (namePart && isValidName(namePart)) {
                    return namePart;
                }
            }
            
            // Check next line
            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                if (isValidName(nextLine)) {
                    return nextLine;
                }
            }
        }
    }
    return null;
}

function extractNameByKeyword(text, lines) {
    const nameKeywords = ['NAMA', 'NAME'];
    
    for (const keyword of nameKeywords) {
        // Pattern 1: "NAMA : JOHN DOE"
        const colonPattern = new RegExp(`${keyword}\\s*:\\s*([A-Z][A-Z\\s.]+?)(?=\\n|$|\\s{2,})`, 'i');
        let match = text.match(colonPattern);
        if (match && isValidName(match[1])) {
            return cleanName(match[1]);
        }
        
        // Pattern 2: "NAMA\nJOHN DOE"
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().toUpperCase().includes(keyword)) {
                // Check same line after keyword
                const sameLine = lines[i].replace(new RegExp(keyword, 'i'), '').replace(':', '').trim();
                if (sameLine && isValidName(sameLine)) {
                    return cleanName(sameLine);
                }
                
                // Check next 1-2 lines
                for (let j = 1; j <= 2; j++) {
                    if (i + j < lines.length) {
                        const nextLine = lines[i + j].trim();
                        if (nextLine && isValidName(nextLine) && !containsKeywords(nextLine)) {
                            return cleanName(nextLine);
                        }
                    }
                }
            }
        }
    }
    
    return null;
}

function extractNameByPosition(text, lines) {
    // Find NIK first, then look for name nearby
    const nikPattern = /\b\d{16}\b/;
    
    for (let i = 0; i < lines.length; i++) {
        if (nikPattern.test(lines[i])) {
            // Check lines around NIK (before and after)
            const searchRange = [-1, 1, 2, -2]; // Check these relative positions
            
            for (const offset of searchRange) {
                const targetIndex = i + offset;
                if (targetIndex >= 0 && targetIndex < lines.length) {
                    const candidate = lines[targetIndex].trim();
                    
                    // Skip if it contains NIK or other keywords
                    if (!nikPattern.test(candidate) && 
                        !containsKeywords(candidate) && 
                        isValidName(candidate)) {
                        return cleanName(candidate);
                    }
                }
            }
        }
    }
    
    return null;
}

function extractNameByPattern(text, lines) {
    // Look for patterns that look like names
    const namePatterns = [
        // All caps names (common in KTP)
        /\b([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})*)\b/g,
        // Mixed case names
        /\b([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g
    ];
    
    for (const pattern of namePatterns) {
        const matches = [...text.matchAll(pattern)];
        
        for (const match of matches) {
            const candidate = match[1];
            
            if (isValidName(candidate) && 
                !containsKeywords(candidate) && 
                candidate.length >= 4 && 
                candidate.length <= 50) {
                
                // Additional validation - should not be common non-name words
                const nonNames = ['REPUBLIK', 'INDONESIA', 'KARTU', 'TANDA', 'PENDUDUK', 'ELEKTRONIK'];
                if (!nonNames.some(word => candidate.includes(word))) {
                    return cleanName(candidate);
                }
            }
        }
    }
    
    return null;
}

function containsKeywords(text) {
    const keywords = [
        'NIK', 'NAMA', 'TEMPAT', 'LAHIR', 'JENIS', 'KELAMIN', 'ALAMAT', 
        'AGAMA', 'KAWIN', 'PEKERJAAN', 'KEWARGANEGARAAN', 'BERLAKU',
        'REPUBLIK', 'INDONESIA', 'KARTU', 'ELEKTRONIK', 'TANDA',
        "PROVINSI", "KABUPATEN", "KOTA", "KECAMATAN", "KELURAHAN", 
        "RW", "RT", "AGAMA", "ISLAM", "KRISTEN", "HINDU", "BUDDHA",
        "WNI", "WNA", "PEREMPUAN", "LAKI-LAKI", "SWASTA", "PNS"
    ];
    
    const upperText = text.toUpperCase();
    return keywords.some(keyword => upperText.includes(keyword));
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

export {extractNameAdvanced}