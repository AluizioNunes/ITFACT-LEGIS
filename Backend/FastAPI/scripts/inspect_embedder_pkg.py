import graphiti_core.embedder
import pkgutil
import inspect

print("Submodules in graphiti_core.embedder:")
for loader, name, is_pkg in pkgutil.iter_modules(graphiti_core.embedder.__path__):
    print(f"- {name}")
    try:
        module = loader.find_module(name).load_module(name)
        for member_name, obj in inspect.getmembers(module):
            if inspect.isclass(obj) and member_name.endswith("Embedder"):
                print(f"  Class: {member_name}")
    except Exception as e:
        print(f"  Error loading {name}: {e}")
