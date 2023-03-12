from cryptography.fernet import Fernet


class PasswordManager:
    def __init_(self):
        self.key = None
        self.pwd_file = None
        self.pwd_dict = {}

    def create_key(self, path):
        self.key = Fernet.generate_key()
        with open(path, 'wb') as f:
            f.write(self.key)

    def load_key(self, path):
        with open(path, 'rb') as f:
            self.key = f.read()

    def create_pwd_file(self, path, init_values=None):
        self.pwd_file = path

        if init_values is not None:
            for key, value in init_values.items():
                self.add_pwd(key, value)
    
    def load_pwd_file(self, path):
        self.pwd_file = path

        with open(path, 'r') as f:
            for line in f:
                site, encrypted = line.split(':')
                self.pwd_dict[site] = Fernet(self.key).decrypt(encrypted.encode()).decode()

    def add_pwd(self, site, pwd):
        self.pwd_dict[site] = pwd

        if self.pwd_file is not None:
            with open(self.pwd_file, 'a+') as f:
                encrypted = Fernet(self.key).encrypt(pwd.encode())
                f.write(site + ':' + encrypted.decode() + '\n')

    def get_pwd(self, site):
        return self.pwd_dict[site]

def main():
    pwd = {
        "email": "114341354",
        "facebook": "wrgdft45",
        "youtube": "rwe6455#4",
        "twitter": "70ydf9s^&h"
    }

    pm = PasswordManager()