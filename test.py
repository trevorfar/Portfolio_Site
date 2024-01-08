class Animals:
    def speak():
        print("I Dont Make Noise")


class dog(Animals):
    def speak():
        print("bark")




d = dog.speak()
a = Animals.speak()