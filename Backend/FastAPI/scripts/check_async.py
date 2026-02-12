from graphiti_core.embedder.openai import OpenAIEmbedder
import inspect

print(f"Is create async? {inspect.iscoroutinefunction(OpenAIEmbedder.create)}")
print(f"Is create_batch async? {inspect.iscoroutinefunction(OpenAIEmbedder.create_batch)}")
