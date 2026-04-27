
#!/bin/bash

# =============================================================================
# CAIRN ZERO - CONSOLE LOG REMOVAL SCRIPT
# =============================================================================
# Removes all console.log statements before production deployment
# =============================================================================

echo "=========================================="
echo "Cairn Zero - Production Log Cleanup"
echo "=========================================="
echo ""

# Create backup directory
BACKUP_DIR="./backups/pre-cleanup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "✓ Backup directory created: $BACKUP_DIR"
echo ""

# Counter for statistics
TOTAL_FILES=0
MODIFIED_FILES=0
CONSOLE_LOGS_FOUND=0
CONSOLE_ERRORS_FOUND=0

# Find all TypeScript and JavaScript files
echo "🔍 Scanning for console statements..."
echo ""

while IFS= read -r file; do
    ((TOTAL_FILES++))
    
    # Count console.log occurrences
    log_count=$(grep -c "console\.log" "$file" 2>/dev/null || echo 0)
    
    # Count console.error occurrences
    error_count=$(grep -c "console\.error" "$file" 2>/dev/null || echo 0)
    
    CONSOLE_LOGS_FOUND=$((CONSOLE_LOGS_FOUND + log_count))
    CONSOLE_ERRORS_FOUND=$((CONSOLE_ERRORS_FOUND + error_count))
    
    if [ "$log_count" -gt 0 ] || [ "$error_count" -gt 0 ]; then
        echo "📝 $file"
        [ "$log_count" -gt 0 ] && echo "   └─ console.log: $log_count"
        [ "$error_count" -gt 0 ] && echo "   └─ console.error: $error_count"
        
        # Create backup
        cp "$file" "$BACKUP_DIR/"
        
        # Comment out console.log statements
        if [ "$log_count" -gt 0 ]; then
            sed -i.bak 's/^\(\s*\)console\.log/\1\/\/ console.log/g' "$file"
            rm "${file}.bak"
            ((MODIFIED_FILES++))
        fi
    fi
done < <(find app components lib -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null)

echo ""
echo "=========================================="
echo "Cleanup Summary"
echo "=========================================="
echo "Files scanned: $TOTAL_FILES"
echo "Files modified: $MODIFIED_FILES"
echo "console.log found and commented: $CONSOLE_LOGS_FOUND"
echo "console.error found (review needed): $CONSOLE_ERRORS_FOUND"
echo ""

if [ "$CONSOLE_ERRORS_FOUND" -gt 0 ]; then
    echo "⚠️  WARNING: console.error statements found!"
    echo "   Review these manually - they may be needed for error tracking."
    echo ""
    echo "Files with console.error:"
    grep -r "console\.error" app components lib --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -l 2>/dev/null | while read file; do
        echo "   - $file"
    done
    echo ""
fi

echo "✓ Backups saved to: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Test the application thoroughly"
echo "3. Commit changes: git add . && git commit -m 'Remove console.log for production'"
echo ""
echo "To restore from backup:"
echo "cp $BACKUP_DIR/* ./"
echo ""
echo "=========================================="
