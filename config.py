from keycloak import KeycloakAdmin

# --- KONFIGURACJA ---
KEYCLOAK_URL = "http://localhost:9081/"
ADMIN_USER = 'admin'
ADMIN_PASS = 'admin'
NEW_REALM_NAME = "simple-notatnik"

# 1. Połączenie początkowe z MASTER (żeby stworzyć nowy realm)
master_admin = KeycloakAdmin(
    server_url=KEYCLOAK_URL,
    username=ADMIN_USER,
    password=ADMIN_PASS,
    realm_name='master',
    verify=False
)

# 2. Stworzenie Realmu: simple-notatnik
print(f"Tworzę realm: {NEW_REALM_NAME}...")
if NEW_REALM_NAME not in [r['realm'] for r in master_admin.get_realms()]:
    master_admin.create_realm(payload={"realm": NEW_REALM_NAME, "enabled": True})
else:
    print(f"Realm {NEW_REALM_NAME} już istnieje.")

# 2b. Tworzymy OSOBNĄ instancję administratora dla nowego realmu.
keycloak_admin = KeycloakAdmin(
    server_url=KEYCLOAK_URL,
    username=ADMIN_USER,
    password=ADMIN_PASS,
    realm_name=NEW_REALM_NAME,     # <--- Cel: nasz nowy realm
    user_realm_name='master',      # <--- Auth: admin jest w masterze
    verify=False
)

# 3. Stworzenie Clienta: frontend-client
print("Tworzę clienta...")
client_id = "frontend-client"  # <--- ZMIANA NAZWY

clients = keycloak_admin.get_clients()
if not any(c['clientId'] == client_id for c in clients):
    keycloak_admin.create_client(payload={
        "clientId": client_id,
        "enabled": True,
        "protocol": "openid-connect",
        
        # --- KLUCZOWE ZMIANY DLA FRONTENDU ---
        "publicClient": True,               # Client authentication: OFF (Brak sekretu)
        "standardFlowEnabled": True,        # Standard flow: ON
        "directAccessGrantsEnabled": False, # Direct access grants: OFF
        "serviceAccountsEnabled": False,    # Dla frontendu zazwyczaj wyłączone
        
        "redirectUris": ["http://localhost:4200/*"], # Gdzie wracać po logowaniu
        "webOrigins": ["http://localhost:4200", "+"] # CORS (Web origins)
    })
    print(f"Client '{client_id}' został utworzony.")
else:
    print(f"Client '{client_id}' już istnieje.")

# 4. UWAGA: Usunięto pobieranie Secretu.
# Klient frontendowy (public) NIE MA sekretu, więc nie ma czego pobierać.

# 5. Stworzenie Użytkownika: jan_kowalski
print("Tworzę użytkownika...")
new_user_username = "jan_kowalski"

user_id = keycloak_admin.get_user_id(new_user_username)

if not user_id:
    user_id = keycloak_admin.create_user(payload={
        "email": "jan@kowalski.pl",
        "username": new_user_username,
        "enabled": True,
        "firstName": "Jan",
        "lastName": "Kowalski"
    })
    
    # 6. Ustawienie hasła
    keycloak_admin.set_user_password(
        user_id=user_id, 
        password="123", 
        temporary=False
    )
    print(f"Użytkownik {new_user_username} stworzony w realmie {NEW_REALM_NAME}.")
else:
    print(f"Użytkownik {new_user_username} już istnieje (ID: {user_id}).")

print("Konfiguracja zakończona sukcesem!")