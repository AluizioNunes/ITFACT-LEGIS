from neo4j import GraphDatabase
import os

# Config from docker-compose/env
URI = "neo4j://localhost:7687"
USER = "neo4j"
PASSWORD = "LEGIS2026" # From .env

def verify_data():
    try:
        driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
        with driver.session() as session:
            # Count nodes
            result = session.run("MATCH (n) RETURN count(n) as count")
            count = result.single()["count"]
            print(f"Total Nodes in Neo4j: {count}")
            
            # List Episodes
            result = session.run("MATCH (e:Episode) RETURN e.name, e.uuid LIMIT 5")
            print("\nRecent Episodes:")
            for record in result:
                print(f"- {record['e.name']} ({record['e.uuid']})")
                
        driver.close()
    except Exception as e:
        print(f"Error connecting to Neo4j: {e}")

if __name__ == "__main__":
    verify_data()
