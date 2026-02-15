import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GOOGLE_AI_API_KEY")
model = os.getenv("AI_MODEL", "gemini-2.0-flash")

print(f"Testing with Key starting with: {key[:5]}...")

client = OpenAI(
    api_key=key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

try:
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": "Hello"}],
    )
    print("Success!")
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Failed: {e}")
