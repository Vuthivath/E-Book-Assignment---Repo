import urllib.request, json, base64

BASE = 'http://127.0.0.1:8000/api'

# Helper function
def req(method, url, data=None, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    body = json.dumps(data).encode() if data else None
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(r)
        return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())
    except Exception as e:
        return 0, str(e)

# 1. Register a test user
print("=== Register test user ===")
status, data = req('POST', f'{BASE}/register/', {
    'username': 'testuser_api',
    'email': 'test_api@test.com',
    'password': 'TestPass123',
    'first_name': 'Test',
    'last_name': 'User',
    'role': 'customer'
})
print(f"Register: {status} - {data}")

# 2. Login
print("\n=== Login ===")
status, data = req('POST', f'{BASE}/login/', {
    'username': 'testuser_api',
    'password': 'TestPass123'
})
print(f"Login: {status}")
if status == 200:
    token = data['access']
    print(f"Token: {token[:30]}...")
    user = data['user']
    print(f"User id: {user['id']}, username: {user['username']}")
else:
    print(f"Login failed: {data}")
    print("Trying to login as existing user...")
    status, data = req('POST', f'{BASE}/login/', {
        'username': 'test',
        'password': 'test123'
    })
    print(f"Login: {status}")
    if status == 200:
        token = data['access']
    else:
        print("Still failed, exiting")
        exit()

# 3. Check books
print("\n=== Books ===")
status, data = req('GET', f'{BASE}/books/')
print(f"Books: {status}, count: {len(data)}")

if len(data) == 0:
    print("No books in database - this is the problem!")
    exit()

book_id = data[0]['id']
print(f"First book: {data[0]['title']} (id={book_id})")

# 4. Create a bookmark
print(f"\n=== Create bookmark for book {book_id} ===")
status, data = req('POST', f'{BASE}/bookmarks/', {'book': book_id}, token=token)
print(f"Create bookmark: {status} - {data}")

# 5. List bookmarks
print("\n=== List bookmarks ===")
status, data = req('GET', f'{BASE}/bookmarks/', token=token)
print(f"List bookmarks: {status}, count: {len(data)}")
for b in data:
    print(f"  - bookmark id={b['id']}, book id={b['book']}, title={b.get('book_title', 'N/A')}")

# 6. Delete bookmark
print(f"\n=== Delete bookmark for book {book_id} ===")
status, data = req('DELETE', f'{BASE}/bookmarks/', {'book': book_id}, token=token)
print(f"Delete bookmark: {status} - {data}")

# 7. List bookmarks again
print("\n=== List bookmarks after delete ===")
status, data = req('GET', f'{BASE}/bookmarks/', token=token)
print(f"List bookmarks: {status}, count: {len(data)}")

# 8. Test books API without auth (should work for anyone)
print("\n=== Books without auth (should work!) ===")
status, data = req('GET', f'{BASE}/books/')
print(f"Books: {status}, count: {len(data)}")
for b in data[:3]:
    print(f"  - id={b['id']}, {b['title']}, ${b['price']}")

print("\n✅ Tests complete!")
