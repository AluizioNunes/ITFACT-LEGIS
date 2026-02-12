from graphiti_core.embedder.openai import OpenAIEmbedder
import inspect

print("OpenAIEmbedder Methods:")
for name, func in inspect.getmembers(OpenAIEmbedder, predicate=inspect.isfunction):
    print(f"- {name}")
