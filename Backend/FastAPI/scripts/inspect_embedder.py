import graphiti_core.embedder.client
import inspect

print("Available Embedder Clients:")
for name, obj in inspect.getmembers(graphiti_core.embedder.client):
    if inspect.isclass(obj):
        print(name)
