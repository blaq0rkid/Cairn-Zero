
#!/bin/bash

# Cairn Zero - Console Log Removal Script
# Remove all console.log statements before production deployment

echo "🔍 Searching for console.log statements..."

# Find all TypeScript and JavaScript files
find src app components -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read file; do
  # Count console.log occurrences
  count=$(grep -c "console\.log" "$file" 2>/dev/null || echo 0)
  
  if [ "$count" -gt 0 ]; then
    echo "📝 Found $count console.log in: $file"
    
    # Comment out console.log statements (safer than deletion)
    sed -i.bak 's/console\.log/\/\/ console.log/g' "$file"
    
    echo "✅ Commented out console.log in: $file"
  fi
done

echo ""
echo "🔍 Searching for console.error statements..."

# Find all console.error (review these manually)
find src app components -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec grep -l "console\.error" {} \; | while read file; do
  echo "⚠️  Review console.error in: $file"
done

echo ""
echo "✅ Console log cleanup complete!"
echo "⚠️  Please review console.error statements manually"
echo "💡 Run 'git diff' to review changes before committing"
