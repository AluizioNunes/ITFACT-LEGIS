from neo4j import GraphDatabase
import os

uri = "bolt://localhost:7687"
user = "neo4j"
password = "LEGIS2026"

def check_neo4j():
    try:
        driver = GraphDatabase.driver(uri, auth=(user, password))
        with driver.session() as session:
            # Count episodes
            res_ep = session.run("MATCH (n:Episode) RETURN count(n) as count")
            ep_count = res_ep.single()["count"]
            
            # Count entities
            res_en = session.run("MATCH (n:Entity) RETURN count(n) as count")
            en_count = res_en.single()["count"]
            
            # Search for specific mention
            res_search = session.run("MATCH (n:Episode) WHERE n.name CONTAINS 'REGIMENTO' RETURN n.name as name LIMIT 5")
            names = [r["name"] for r in res_search]
            
            print(f"Neo4j Stats:")
            print(f"- Episode Count: {ep_count}")
            print(f"- Entity Count: {en_count}")
            print(f"- Sample Episode Names: {names}")
            
        driver.close()
    except Exception as e:
        print(f"Failed to connect to Neo4j: {e}")

if __name__ == "__main__":
    check_neo4j()
