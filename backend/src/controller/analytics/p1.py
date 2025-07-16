import requests
import time
from collections import Counter
from transformers import pipeline
import json

LIMIT_PUBLICACIONES_GENERAL = 200
LIMIT_COMENTARIOS = 100

ACCESS_TOKEN_PRINCIPAL = "EAAQI0ZBbipAgBO7I8oBHIMP9i6KauuZBCCTHoEsuiBXl2iAAAZBujZAOZBSR5Uq8t5KvLNAkPKvHHkkHoFQfFmWdEc4FVORLz8VTAfys5n53lcddZCFLxpXx4tdZAS7ZBbbs8xMtW2Cz7ZBFUZCF8qDYvnqwGf9VCA82MvKIpxhKBKHORLI9A0cVqZBt3EK3icXjYL4pckOo2EZD"
ACCESS_TOKEN_RESPALDO = None  
PAGE_ID = "100968166227091"

classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1)

def verificar_token_valido(token):
    url = f"https://graph.facebook.com/v22.0/me?access_token={token}"
    resp = requests.get(url)
    if resp.status_code != 200:
        print("⚠ Token inválido o expirado.")
        return False
    return True

def obtener_token_valido(token_principal, token_respaldo=None):
    if verificar_token_valido(token_principal):
        print("Token principal válido.")
        return token_principal
    elif token_respaldo and verificar_token_valido(token_respaldo):
        print("Usando token de respaldo.")
        return token_respaldo
    else:
        raise Exception("Ningún token válido disponible. Por favor, genera un nuevo token.")

def analizar_emocion(texto):
    if not texto.strip():
        return "Neutral"
    try:
        resultado = classifier(texto)
        print(f"Resultado bruto del modelo: {resultado}")
        return resultado[0][0]['label']  #acceso correcto
    except Exception as e:
        print(f"Error analizando texto: {texto[:30]}... → {e}")
        return "Error"


def obtener_reacciones(post_id, token):
    url = f"https://graph.facebook.com/v22.0/{post_id}?fields=reactions.summary(true)&access_token={token}"
    resp = requests.get(url)
    if resp.status_code != 200:
        return {}
    data = resp.json()
    return data.get("reactions", {}).get("summary", {})

def obtener_comentarios_y_emociones(post_id, token):
    emociones = []
    url = f"https://graph.facebook.com/v22.0/{post_id}/comments?limit={LIMIT_COMENTARIOS}&access_token={token}"
    while url:
        resp = requests.get(url)
        if resp.status_code != 200:
            break
        data = resp.json()
        for comment in data.get("data", []):
            text = comment.get("message", "").strip()
            if not text:
                continue
            print(f" Comentario: {text}")  #  Aquí imprimes el comentario real
            emocion = analizar_emocion(text)
            emociones.append(emocion)
        url = data.get("paging", {}).get("next")
    return emociones

def scraping_general(page_id, token_principal, token_respaldo=None, max_publicaciones=LIMIT_PUBLICACIONES_GENERAL):
    token = obtener_token_valido(token_principal, token_respaldo)
    url = f"https://graph.facebook.com/v22.0/{page_id}/posts?limit=100&access_token={token}"
    publicaciones_data = {}
    total = 0
    while url and total < max_publicaciones:
        resp = requests.get(url)
        if resp.status_code != 200:
            print(f"Error al obtener publicaciones: {resp.text}")
            break
        data = resp.json()
        for post in data.get("data", []):
            post_id = post.get("id")
            if not post_id:
                continue
            print(f"Analizando publicación {post_id}...")
            emociones = obtener_comentarios_y_emociones(post_id, token)
            reacciones = obtener_reacciones(post_id, token)
            publicaciones_data[post_id] = {
                "comentarios": len(emociones),
                "emociones": dict(Counter(emociones)),
                "reacciones": reacciones
            }
            total += 1
            if total >= max_publicaciones:
                break
            time.sleep(0.5)
        url = data.get("paging", {}).get("next")
    return publicaciones_data

def generar_reporte(publicaciones_data):
    resumen = {
        "mayor_interaccion": None,
        "mejor_aceptacion": None,
        "peor_aceptacion": None
    }
    emociones_positivas = {"joy", "love", "surprise"}
    emociones_negativas = {"anger", "sadness", "fear", "disgust"}
    interacciones = []

    for post_id, data in publicaciones_data.items():
        total_reacciones = data["reacciones"].get("total_count", 0)
        total_comentarios = data["comentarios"]
        total_interaccion = total_reacciones + total_comentarios
        emocion_counter = Counter(data["emociones"])
        positivas = sum(v for k, v in emocion_counter.items() if k in emociones_positivas)
        negativas = sum(v for k, v in emocion_counter.items() if k in emociones_negativas)
        interacciones.append({
            "post_id": post_id,
            "total_interaccion": total_interaccion,
            "emocion_predominante": emocion_counter.most_common(1)[0][0] if emocion_counter else "Neutral",
            "positivas": positivas,
            "negativas": negativas
        })

    if interacciones:
        resumen["mayor_interaccion"] = max(interacciones, key=lambda x: x["total_interaccion"])
        resumen["mejor_aceptacion"] = max(interacciones, key=lambda x: x["positivas"])
        resumen["peor_aceptacion"] = max(interacciones, key=lambda x: x["negativas"])

    return resumen

if __name__ == "__main__":
    publicaciones = scraping_general(PAGE_ID, ACCESS_TOKEN_PRINCIPAL, ACCESS_TOKEN_RESPALDO)
    resumen = generar_reporte(publicaciones)

    print("Publicaciones analizadas:")
    for post_id, data in publicaciones.items():
        print(f"Post {post_id}: {data['comentarios']} comentarios, {data['reacciones'].get('total_count', 0)} reacciones, emociones: {data['emociones']}")

    print("\n RESUMEN:")
    print(resumen)

    # Guardar los datos completos por publicación
with open("generated/resultado.json", "w", encoding="utf-8") as f:
    json.dump(publicaciones, f, indent=2, ensure_ascii=False)

# Guardar el resumen (publicación con más interacción, mejor y peor aceptación)
with open("generated/resumen.json", "w", encoding="utf-8") as f:
    json.dump(resumen, f, indent=2, ensure_ascii=False)

print("ANALISIS_OK")
