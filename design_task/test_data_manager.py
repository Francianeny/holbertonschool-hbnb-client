import unittest
from data_manager import DataManager

class TestDataManager(unittest.TestCase):
    def setUp(self):
        self.manager = DataManager('test_data.json')

    def test_save_user(self):
        user_data = {'username': 'john_doe', 'email': 'john@example.com', 'password': 'password123'}
        user_id = self.manager.save_user(user_data)
        self.assertEqual(len(self.manager.get_all_users()), 1)
        self.assertEqual(self.manager.get_user(user_id)['username'], 'john_doe')

    def test_update_user(self):
        user_data = {'username': 'john_doe', 'email': 'john@example.com', 'password': 'password123'}
        user_id = self.manager.save_user(user_data)
        updated_data = {'username': 'john_doe_updated'}
        self.manager.update_user(user_id, updated_data)
        self.assertEqual(self.manager.get_user(user_id)['username'], 'john_doe_updated')

    def test_delete_user(self):
        user_data = {'username': 'john_doe', 'email': 'john@example.com', 'password': 'password123'}
        user_id = self.manager.save_user(user_data)
        self.manager.delete_user(user_id)
        self.assertIsNone(self.manager.get_user(user_id))

    def tearDown(self):
        import os
        os.remove('test_data.json')

if __name__ == '__main__':
    unittest.main()
