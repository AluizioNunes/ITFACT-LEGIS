import httpx
import asyncio
import traceback

BASE_URL = "http://127.0.0.1:8000"

async def test_specific_query():
    async with httpx.AsyncClient(timeout=600.0) as client:
        print("\n--- TESTANDO PERGUNTA DO USUÁRIO ---")
        question = "Qual o tempo de uma mandato do presidente da e qunatas vezes ele pode se reeleger?"
        print(f"Pergunta: {question}")
        
        try:
            payload = {"message": question, "context_path": "/dashboard/legislativo/"}
            print("   Enviando requisição para /chat/query...")
            resp = await client.post(f"{BASE_URL}/chat/query", json=payload)
            
            if resp.status_code == 200:
                data = resp.json()
                print("\n--- RESPOSTA DA IA ---")
                print(data.get('response', 'Sem resposta'))
                print("\nFontes:", data.get('sources', []))
            else:
                print(f"   ERRO: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"   EXCEÇÃO: {e}")
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_specific_query())
