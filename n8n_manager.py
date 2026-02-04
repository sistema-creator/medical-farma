import os
import sys
import json
import requests
import argparse

# Configuration from environment variables
N8N_BASE_URL = os.environ.get("N8N_BASE_URL", "http://localhost:5678").rstrip("/")
N8N_API_KEY = os.environ.get("N8N_API_KEY")

HEADERS = {
    "X-N8N-API-KEY": N8N_API_KEY,
    "Content-Type": "application/json"
}

def check_config():
    if not N8N_API_KEY:
        print("Error: N8N_API_KEY environment variable is not set.")
        sys.exit(1)

def list_workflows():
    response = requests.get(f"{N8N_BASE_URL}/api/v1/workflows", headers=HEADERS)
    response.raise_for_status()
    print(json.dumps(response.json(), indent=2))

def get_workflow(workflow_id):
    response = requests.get(f"{N8N_BASE_URL}/api/v1/workflows/{workflow_id}", headers=HEADERS)
    response.raise_for_status()
    print(json.dumps(response.json(), indent=2))

def create_workflow(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        workflow_data = json.load(f)
    response = requests.post(f"{N8N_BASE_URL}/api/v1/workflows", headers=HEADERS, json=workflow_data)
    response.raise_for_status()
    print(json.dumps(response.json(), indent=2))

def update_workflow(workflow_id, file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        workflow_data = json.load(f)
    response = requests.patch(f"{N8N_BASE_URL}/api/v1/workflows/{workflow_id}", headers=HEADERS, json=workflow_data)
    response.raise_for_status()
    print(json.dumps(response.json(), indent=2))

def set_activation(workflow_id, active):
    action = "activate" if active else "deactivate"
    # Note: Modern n8n uses PATCH to update activation state or specific endpoints depending on version.
    # Official API v1 uses POST /workflows/{id}/activate
    url = f"{N8N_BASE_URL}/api/v1/workflows/{workflow_id}/{action}"
    response = requests.post(url, headers=HEADERS)
    response.raise_for_status()
    print(json.dumps(response.json(), indent=2))

def run_webhook(webhook_url, data_json):
    data = json.loads(data_json)
    response = requests.post(webhook_url, json=data)
    response.raise_for_status()
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="n8n Manager CLI")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("list", help="List all workflows")
    
    get_p = subparsers.add_parser("get", help="Get workflow by ID")
    get_p.add_argument("id")

    create_p = subparsers.add_parser("create", help="Create workflow from JSON file")
    create_p.add_argument("file")

    update_p = subparsers.add_parser("update", help="Update workflow from JSON file")
    update_p.add_argument("id")
    update_p.add_argument("file")

    activate_p = subparsers.add_parser("activate", help="Activate workflow")
    activate_p.add_argument("id")

    deactivate_p = subparsers.add_parser("deactivate", help="Deactivate workflow")
    deactivate_p.add_argument("id")

    run_p = subparsers.add_parser("run_webhook", help="Execute a webhook")
    run_p.add_argument("url")
    run_p.add_argument("--data", default="{}")

    args = parser.parse_args()
    check_config()

    try:
        if args.command == "list":
            list_workflows()
        elif args.command == "get":
            get_workflow(args.id)
        elif args.command == "create":
            create_workflow(args.file)
        elif args.command == "update":
            update_workflow(args.id, args.file)
        elif args.command == "activate":
            set_activation(args.id, True)
        elif args.command == "deactivate":
            set_activation(args.id, False)
        elif args.command == "run_webhook":
            run_webhook(args.url, args.data)
        else:
            parser.print_help()
    except requests.exceptions.HTTPError as e:
        print(f"Error: {e}")
        if e.response is not None:
             print(f"Response: {e.response.text}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
