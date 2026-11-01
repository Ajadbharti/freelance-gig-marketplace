KEY="$(pbpaste | tr -d '[:space:]"\047')"
URL="https://pwrbkzlpfricutohtldd.supabase.co"
echo "Clipboard length: ${#KEY}"
echo "Clipboard starts with: ${KEY:0:14}"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/rest/v1/gigs?select=id&limit=1" -H "apikey: $KEY")
echo "Supabase answered: $CODE"
if [ "$CODE" = "200" ]; then
  printf 'NEXT_PUBLIC_SUPABASE_URL=%s\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=%s\n' "$URL" "$KEY" > .env.local
  echo "SUCCESS: .env.local written. Now restart npm run dev."
else
  echo "NOT written. This key is not accepted."
fi
