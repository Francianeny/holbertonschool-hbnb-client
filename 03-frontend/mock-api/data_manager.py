import json

class DataManager:
    def __init__(self, users_file='users.json', places_file='places.json'):
        self.users_file = users_file
        self.places_file = places_file
        self.load_data()

    def load_data(self):
        """Load data from JSON files."""
        try:
            with open(self.users_file, 'r') as file:
                self.users_data = json.load(file)
        except FileNotFoundError:
            self.users_data = []

        try:
            with open(self.places_file, 'r') as file:
                self.places_data = json.load(file)
        except FileNotFoundError:
            self.places_data = []

    def save_data(self):
        """Save data to JSON files."""
        with open(self.users_file, 'w') as file:
            json.dump(self.users_data, file, indent=4)

        with open(self.places_file, 'w') as file:
            json.dump(self.places_data, file, indent=4)

    # User Methods
    def get_all_users(self):
        return self.users_data

    def get_user(self, user_id):
        return next((user for user in self.users_data if user['id'] == user_id), None)

    def get_user_by_email(self, email):
        return next((user for user in self.users_data if user['email'] == email), None)

    def save_user(self, user_data):
        user_id = str(len(self.users_data) + 1)  # Simple ID generation logic
        user_data['id'] = user_id
        self.users_data.append(user_data)
        self.save_data()
        return user_id

    def update_user(self, user_id, updated_data):
        user = self.get_user(user_id)
        if user:
            user.update(updated_data)
            self.save_data()
            return True
        return False

    def delete_user(self, user_id):
        user = self.get_user(user_id)
        if user:
            self.users_data.remove(user)
            self.save_data()
            return True
        return False

    # Place Methods
    def get_all_places(self):
        return self.places_data

    def get_place(self, place_id):
        return next((place for place in self.places_data if place['id'] == place_id), None)

    def save_place(self, place_data):
        place_id = str(len(self.places_data) + 1)  # Simple ID generation logic
        place_data['id'] = place_id
        self.places_data.append(place_data)
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
            self.places_data.remove(place)
            self.save_data()
            return True
        return False
