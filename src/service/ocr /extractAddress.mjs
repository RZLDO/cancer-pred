// extractAddress.mjs - FIXED VERSION

/**
 * Extract address from Indonesian ID card (KTP) OCR text - IMPROVED
 */

// Common Indonesian street prefixes and patterns
const STREET_PATTERNS = [
    'JL\\.',
    'JALAN',
    'JLN\\.',
    'JLN',
    'GG\\.',
    'GANG',
    'KOMP\\.',
    'KOMPLEK',
    'PERUMAHAN',
    'PERUM\\.',
    'BLOK',
    'NO\\.',
    'NOMOR'
];

// RT/RW patterns
const RT_RW_PATTERN = /(\d{3}\/\d{3}|\d{2}\/\d{2}|\d{1}\/\d{1,3})/;

// Common address keywords to stop at
const STOP_KEYWORDS = [
    'RT/RW',
    'RT\/RW',
    'KEL/DESA',
    'KEL\/DESA',
    'KELURAHAN',
    'DESA',
    'KECAMATAN',
    'GOL\\.',
    'GOL\\.\\s*DARAH',
    'DARAH',
    'AGAMA',
    'STATUS',
    'PEKERJAAN',
    'KEWARGANEGARAAN',
    'BERLAKU',
    'HINGGA'
];

/**
 * Clean and format address text
 */
function cleanAddress(address) {
    if (!address) return '';
    
    return address
        .replace(/\s+/g, ' ')           // Multiple spaces to single space
        .replace(/[:\-]+$/g, '')       // Remove trailing colons and dashes
        .replace(/^\s*:\s*/, '')       // Remove leading colon
        .replace(/\s*:\s*$/, '')       // Remove trailing colon
        .trim();
}

/**
 * Extract address using enhanced pattern matching - MAIN STRATEGY
 */
function extractAddressByEnhancedPattern(text) {
    // Strategy 1: Look for street pattern followed by address, then RT/RW
    // Pattern: JL. PASTI CEPAT A7/66 : 007/008 RT/RW
    const streetBeforeRTRW = new RegExp(
        `(${STREET_PATTERNS.join('|')})\\s*([A-Z0-9\\s\\/\\-\\.]+?)\\s*:\\s*\\d+\\/\\d+\\s*RT\\/RW`,
        'i'
    );
    
    let match = text.match(streetBeforeRTRW);
    if (match) {
        let address = (match[1] + ' ' + match[2]).trim();
        address = cleanAddress(address);
        console.log(`Found address by street-before-RTRW pattern: ${address}`);
        return address;
    }
    
    // Strategy 2: Look for street pattern between colons
    // Pattern: : JL. PASTI CEPAT A7/66 :
    const streetBetweenColons = new RegExp(
        `:\\s*(${STREET_PATTERNS.join('|')})\\s*([A-Z0-9\\s\\/\\-\\.]+?)\\s*:`,
        'i'
    );
    
    match = text.match(streetBetweenColons);
    if (match) {
        let address = (match[1] + ' ' + match[2]).trim();
        address = cleanAddress(address);
        console.log(`Found address by street-between-colons pattern: ${address}`);
        return address;
    }
    
    // Strategy 3: Look for street pattern followed by RT/RW
    const streetFollowedByRTRW = new RegExp(
        `(${STREET_PATTERNS.join('|')})\\s*([A-Z0-9\\s\\/\\-\\.]+?)(?=\\s*:?\\s*\\d+\\/\\d+\\s*RT\\/RW)`,
        'i'
    );
    
    match = text.match(streetFollowedByRTRW);
    if (match) {
        let address = (match[1] + ' ' + match[2]).trim();
        address = cleanAddress(address);
        console.log(`Found address by street-followed-by-RTRW pattern: ${address}`);
        return address;
    }
    
    // Strategy 4: Generic street pattern with better boundaries
    const genericStreetPattern = new RegExp(
        `(${STREET_PATTERNS.join('|')})\\s*([A-Z0-9\\s\\/\\-\\.]{3,30})(?=\\s*(?::|\\d+\\/\\d+|RT\\/RW|KEL\\/DESA|${STOP_KEYWORDS.join('|')}))`,
        'i'
    );
    
    match = text.match(genericStreetPattern);
    if (match) {
        let address = (match[1] + ' ' + match[2]).trim();
        address = cleanAddress(address);
        console.log(`Found address by generic street pattern: ${address}`);
        return address;
    }
    
    return null;
}

/**
 * Extract address by finding context around "Alamat" keyword
 */
function extractAddressByKeywordContext(text) {
    // Look for "Alamat" in various forms
    const alamatPatterns = [
        /Alamat\s*([^:]*?):\s*([^:]+?)(?=\s*:|$)/i,
        /Alamat[:\s]*([A-Z0-9\s\/\-\.]+?)(?=\s*(?:RT\/RW|KEL\/DESA|PROVINSI|GOL\.|:|$))/i
    ];
    
    for (const pattern of alamatPatterns) {
        const match = text.match(pattern);
        if (match) {
            let address = match[match.length - 1]; // Get the last capture group
            
            // Clean the address
            address = cleanAddress(address);
            
            // Filter out obvious non-address content
            if (!address.match(/^(PROVINSI|DKI|JAKARTA|BARAT|TIMUR|SELATAN|UTARA|PUSAT)$/i) &&
                !address.match(/^\d{16}$/) && // Not NIK
                !address.match(/^(LAKI-LAKI|PEREMPUAN)$/i) && // Not gender
                address.length > 3) {
                
                console.log(`Found address by keyword context: ${address}`);
                return address;
            }
        }
    }
    
    return null;
}

/**
 * Extract address using positional analysis
 */
function extractAddressByPosition(text) {
    // Split by common delimiters and look for street patterns
    const parts = text.split(/[:\n\r]+/);
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        
        // Check if this part contains a street pattern
        const streetPattern = new RegExp(`(${STREET_PATTERNS.join('|')})`, 'i');
        if (part.match(streetPattern)) {
            let address = cleanAddress(part);
            
            // Validate it's not mixed with other data
            if (address.length > 3 && 
                !address.match(/^(PROVINSI|DKI)/i) &&
                !address.includes('JAKARTA') &&
                !address.match(/^\d{16}/)) {
                
                console.log(`Found address by position: ${address}`);
                return address;
            }
        }
    }
    
    return null;
}

/**
 * Main address extraction function with improved strategies
 */
function extractAddressAdvanced(text) {
    if (!text) return null;
    
    console.log('Original text:', text);
    
    const strategies = [
        { name: 'enhanced-pattern', fn: extractAddressByEnhancedPattern },
        { name: 'keyword-context', fn: extractAddressByKeywordContext },
        { name: 'position', fn: extractAddressByPosition }
    ];
    
    for (const strategy of strategies) {
        try {
            const result = strategy.fn(text);
            if (result && result.length > 3 && isValidAddress(result)) {
                console.log(`✓ SUCCESS: Found address by ${strategy.name}: "${result}"`);
                return result;
            }
        } catch (error) {
            console.log(`Strategy ${strategy.name} failed:`, error.message);
        }
    }
    
    console.log('❌ FAILED: No valid address found');
    return null;
}

/**
 * Improved address validation
 */
function isValidAddress(address) {
    if (!address || address.length < 4) return false;
    
    // Should contain some letters
    if (!address.match(/[A-Z]/i)) return false;
    
    // Should not be just numbers
    if (address.match(/^\d+$/)) return false;
    
    // Should not be personal info
    if (address.match(/^\d{16}$/) || // NIK
        address.match(/^(LAKI-LAKI|PEREMPUAN)$/i) || // Gender
        address.match(/^(ISLAM|KRISTEN|KATOLIK|HINDU|BUDDHA|KONGHUCU)$/i) || // Religion
        address.match(/^(PROVINSI|DKI|JAKARTA|BARAT|TIMUR|SELATAN|UTARA|PUSAT)$/i)) { // Province/City
        return false;
    }
    
    // Prefer addresses with street indicators
    if (address.match(new RegExp(`(${STREET_PATTERNS.join('|')})`, 'i'))) {
        return true;
    }
    
    // Or addresses with numbers (house numbers)
    if (address.match(/\d+/) && address.match(/[A-Z]/i)) {
        return true;
    }
    
    return address.length > 5; // Minimum length for meaningful address
}

// Test function to verify the fix
function testAddressExtraction() {
    const testText = "NIK Nama Tempat/Tgl Lahir Jenis Kelamin Alamat PROVINSI DKI JAKARTA JAKARTA BARAT : 3171234567890123 : MIRA SETIAWAN : JAKARTA, 18-02-1986 Gol. Darah : B : PEREMPUAN : JL. PASTI CEPAT A7/66 : 007/008 RT/RW Kel/Desa : PEGADUNGAN";
    
    console.log('=== TESTING ADDRESS EXTRACTION ===');
    const result = extractAddressAdvanced(testText);
    console.log('Final result:', result);
    
    return result;
}

// Export functions
export {
    extractAddressAdvanced,
    extractAddressByEnhancedPattern,
    extractAddressByKeywordContext, 
    extractAddressByPosition,
    cleanAddress,
    isValidAddress,
    testAddressExtraction
};

// Run test if this is the main module
if (typeof process !== 'undefined' && process.argv[1] === new URL(import.meta.url).pathname) {
    testAddressExtraction();
}