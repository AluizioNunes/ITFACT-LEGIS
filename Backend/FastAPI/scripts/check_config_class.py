import graphiti_core.embedder.openai as m
import inspect

print("Dir of graphiti_core.embedder.openai:")
print(dir(m))

if hasattr(m, 'OpenAIEmbedderConfig'):
    print("\nOpenAIEmbedderConfig found!")
    print(inspect.signature(m.OpenAIEmbedderConfig))
    print(m.OpenAIEmbedderConfig.__annotations__)
else:
    print("\nOpenAIEmbedderConfig NOT found.")
