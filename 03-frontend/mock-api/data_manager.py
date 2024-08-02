import json

class DataManager:
    def __init__(self, data_file='data.json', user_file='users.json'):
        self.data_file = data_file
        self.user_file = user_file
        self.load_data()
        self.load_users()

    def load_data(self):
        """Load data from the JSON file."""
        try:
            with open(self.data_file, 'r') as file:
                self.data = json.load(file)
        except FileNotFoundError:
            self.data = {'users': [], 'places': []}
        except json.JSONDecodeError:
            self.data = {'users': [], 'places': []}

    def load_users(self):
        """Load user data from the users JSON file."""
        try:
            with open(self.user_file, 'r') as file:
                self.users = json.load(file)
        except FileNotFoundError:
            self.users = []
        except json.JSONDecodeError:
            self.users = []

    def save_data(self):
        """Save data to the JSON file."""
        with open(self.data_file, 'w') as file:
            json.dump(self.data, file, indent=4)

    def get_all_users(self):
        return self.users

    def get_user(self, user_id):
        return next((user for user in self.users if user['id'] == user_id), None)

    def get_user_by_email(self, email):
        return next((user for user in self.users if user['email'] == email), None)

    def verify_user(self, email, password):
        user = self.get_user_by_email(email)
        return user if user and user['password'] == password else None

    def save_user(self, user_data):
        user_data['id'] = str(len(self.users) + 1)  # Simple ID generation logic
        self.users.append(user_data)
        self.save_users()
        return user_data['id']

    def save_users(self):
        """Save user data to the users JSON file."""
        with open(self.user_file, 'w') as file:
            json.dump(self.users, file, indent=4)

    def update_user(self, user_id, updated_data):
        user = self.get_user(user_id)
        if user:
            user.update(updated_data)
            self.save_users()
            return True
        return False

    def delete_user(self, user_id):
        user = self.get_user(user_id)
        if user:
            self.users.remove(user)
            self.save_users()
            return True
        return False

    # Place Methods (unchanged)
    def get_all_places(self):
        return self.data['places']

    def get_place(self, place_id):
        return next((place for place in self.data['places'] if place['place_id'] == place_id), None)

    def save_place(self, place_data):
        place_id = str(len(self.data['places']) + 1)  # Simple ID generation logic
        place_data['place_id'] = place_id
        self.data['places'].append(place_data)
        self.save_data()
        return place_id

    def update_place(self, place_id, updated_data):
        place = self.get_place(place_id)
        if place:
            place.update(updated_data)
            self.save_data()
            return True
        return False

    def delete_place(self, place_id):
        place = self.get_place(place_id)
        if place:
            self.data['places'].remove(place)
            self.save_data()
            return True
        return False
