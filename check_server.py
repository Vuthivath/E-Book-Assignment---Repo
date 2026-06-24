import urllib.request, json, sys

try:
    data = urllib.request.urlopen('http://127.0.0.1:8000/api/books/', timeout=3).read()
    books = json.loads(data)
    count = len(books) if isinstance(books, list) else len(books.get('results', []))
    print(f'✅ Django server running. Books found: {count}')
    if isinstance(books, list) and count > 0:
        print(f'   First book: {books[0].get("title", "N/A")}')
except Exception as e:
    print(f'❌ Failed: {e}')
    sys.exit(1)
