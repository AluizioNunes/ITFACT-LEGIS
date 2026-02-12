import sys
import os
import asyncio
import logging
from graphiti_core.llm_client import LLMConfig, OpenAIClient

# Add parent dir to path to import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.AIConfig import ai_config

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logging.getLogger("httpx").setLevel(logging.DEBUG)
logging.getLogger("openai").setLevel(logging.DEBUG)

async def test_llm():
    print("INFO: Testing OpenAIClient (LLM) with Google Adapter...")
    
    active_key = ai_config.get_active_key()
    
    # Try the base_url we used
    base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
    model = ai_config.model or "gemini-2.0-flash"
    
    print(f"Config: BaseURL={base_url}, Model={model}")
    
    config = LLMConfig(
        api_key=active_key,
        model=model,
        base_url=base_url
    )
    
    client = OpenAIClient(config=config)
    
    try:
        # Test simple chat completion
        # OpenAIClient has .chat() or similar?
        # graphiti_core.llm_client.OpenAIClient.chat_completion?
        # Let's check the method name or just standard create
        
        # It seems OpenAIClient wraps AsyncOpenAI.
        # But let's check inspect first if unsure.
        # Assuming verify connectivity via simple call suitable for the wrapper.
        
        # If I look at BancoDados.py, it passes llm_client to Graphiti.
        # Graphiti calls llm_client.generate(...) probably?
        
        # Let's try to find a method on client. 
        # Inspecting client first is safer.
        pass
    except Exception as e:
        print(f"ERROR setup: {e}")

    # Inspect methods
    import inspect
    print("Methods of OpenAIClient:")
    for name, _ in inspect.getmembers(client, predicate=inspect.ismethod):
        print(f"- {name}")
        
    # Attempt generation if 'generate_response' exists
    if hasattr(client, 'generate_response'):
        try:
            # generate_response expects objects with .content and .role
            class Message:
                def __init__(self, role, content):
                    self.role = role
                    self.content = content
            
            messages = [Message("user", "Hello, are you there?")]
            res = await client.generate_response(messages)
            print(f"SUCCESS: {res}")
        except Exception as e:
            print(f"ERROR generate_response: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_llm())
