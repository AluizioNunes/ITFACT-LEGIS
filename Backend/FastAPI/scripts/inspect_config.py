from graphiti_core.llm_client import LLMConfig
from graphiti_core.embedder.openai import OpenAIEmbedder
import inspect

print("LLMConfig fields:")
print(LLMConfig.__annotations__)

print("\nOpenAIEmbedder.__init__ signature:")
print(inspect.signature(OpenAIEmbedder.__init__))

# access source if possible
try:
    import graphiti_core.embedder.openai as m
    print("\nSource of OpenAIEmbedder.__init__:")
    print(inspect.getsource(m.OpenAIEmbedder.__init__))
except Exception as e:
    print(f"Could not get source: {e}")
