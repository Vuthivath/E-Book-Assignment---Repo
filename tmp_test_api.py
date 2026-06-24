import urllib.request, json

# Test GET books (no auth required)
req = urllib.request.urlopen('http://127.0.0.1:8000/api/books/')
data = json.loads(req.read())
print(f"Books count: {len(data)}")
for b in data[:5]:
    print(f"  - {b['title']} (id={b['id']})")

# Test GET categories
req = urllib.request.urlopen('http://127.0.0.1:8000/api/categories/')
data = json.loads(req.read())
print(f"\nCategories count: {len(data)}")
for c in data[:5]:
    print(f"  - {c['name']} (id={c['id']})")
