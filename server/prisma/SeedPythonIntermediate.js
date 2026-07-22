const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PYTHON_INTERMEDIATE_MODULES = [
  {
    slug: "module-1", title: "List Comprehensions",
    theory: "A list comprehension builds a new list in a single readable line: [expression for item in iterable if condition]. It replaces the common pattern of creating an empty list and appending inside a loop.",
    examples: [{ code: "squares = [n**2 for n in range(6)]\nprint(squares)", explanation: "Builds [0, 1, 4, 9, 16, 25] without a manual loop and append." }],
    practice: [{ prompt: "Use a list comprehension to build a list of even numbers from 1 to 10.", starterCode: "# write your code below\n", solution: "evens = [n for n in range(1, 11) if n % 2 == 0]\nprint(evens)", expectedOutput: "[2, 4, 6, 8, 10]" }],
    quiz: [
      { q: "What does [x for x in range(3)] produce?", options: ["[0,1,2]", "[1,2,3]", "(0,1,2)", "Error"], correct: 0 },
      { q: "Which part filters items in a list comprehension?", options: ["the for clause", "an optional if clause", "the expression", "brackets"], correct: 1 },
      { q: "What does [x*2 for x in [1,2,3]] return?", options: ["[1,2,3]", "[2,4,6]", "[2,2,2]", "Error"], correct: 1 },
      { q: "List comprehensions mainly replace which pattern?", options: ["try/except", "empty list + loop + append", "function definitions", "class declarations"], correct: 1 },
      { q: "Can a list comprehension include an if/else expression too?", options: ["No, never", "Yes, e.g. [x if x>0 else 0 for x in nums]", "Only with lambda", "Only in Python 2"], correct: 1 },
    ],
  },
  {
    slug: "module-2", title: "Nested Data Structures",
    theory: "Real data is often nested — lists of dictionaries, dictionaries of lists, and so on. Accessing values means chaining indexes and keys together, one layer at a time.",
    examples: [{ code: 'students = [{"name": "Ravi", "scores": [80, 90]}]\nprint(students[0]["scores"][1])', explanation: "Drills into the first student's second score: 90." }],
    practice: [{ prompt: "Given data = {'team': [{'name':'A'},{'name':'B'}]}, print the name of the second member.", starterCode: "data = {'team': [{'name':'A'},{'name':'B'}]}\n# write your code below\n", solution: "print(data['team'][1]['name'])", expectedOutput: "B" }],
    quiz: [
      { q: "How do you access the 2nd item of a list stored under key 'x' in a dict d?", options: ["d.x[1]", "d['x'][1]", "d[1]['x']", "d('x')[1]"], correct: 1 },
      { q: "A list of dictionaries is useful for representing what?", options: ["A single value", "A collection of records with fields", "Only numbers", "File paths"], correct: 1 },
      { q: "What error occurs if you access a key that doesn't exist?", options: ["IndexError", "KeyError", "TypeError", "ValueError"], correct: 1 },
      { q: "Can dictionaries contain other dictionaries as values?", options: ["No", "Yes, nesting is common", "Only lists can nest", "Only in JSON"], correct: 1 },
      { q: "What does [ [1,2], [3,4] ][1][0] return?", options: ["1", "2", "3", "4"], correct: 2 },
    ],
  },
  {
    slug: "module-3", title: "*args and **kwargs",
    theory: "*args collects extra positional arguments into a tuple, and **kwargs collects extra keyword arguments into a dictionary — both let a function accept a flexible number of inputs.",
    examples: [{ code: "def total(*nums):\n    return sum(nums)\n\nprint(total(1,2,3,4))", explanation: "nums becomes (1,2,3,4) inside the function; sum() adds them to 10." }],
    practice: [{ prompt: "Write a function show(**info) that prints each key-value pair, then call show(name='Sam', age=15).", starterCode: "# write your code below\n", solution: "def show(**info):\n    for k, v in info.items():\n        print(k, v)\n\nshow(name='Sam', age=15)", expectedOutput: "name Sam\nage 15" }],
    quiz: [
      { q: "What data type does *args collect arguments into?", options: ["list", "tuple", "dict", "set"], correct: 1 },
      { q: "What data type does **kwargs collect arguments into?", options: ["list", "tuple", "dict", "set"], correct: 2 },
      { q: "What does def f(*args) allow?", options: ["Exactly one argument", "Any number of positional arguments", "Only keyword arguments", "No arguments"], correct: 1 },
      { q: "How would you call f(**kwargs) with name and age?", options: ["f(name='A', age=1)", "f('A', 1)", "f[name='A']", "f{name:'A'}"], correct: 0 },
      { q: "Can a function use both *args and **kwargs together?", options: ["No", "Yes", "Only in classes", "Only with lambda"], correct: 1 },
    ],
  },
  {
    slug: "module-4", title: "Lambda Functions",
    theory: "A lambda is a small, unnamed function written in a single expression: lambda arguments: expression. Useful for short throwaway functions, often passed to other functions.",
    examples: [{ code: "square = lambda x: x ** 2\nprint(square(6))", explanation: "Defines an anonymous function and immediately calls it via a name." }],
    practice: [{ prompt: "Write a lambda that adds two numbers, assign it to add, then print add(4, 9).", starterCode: "# write your code below\n", solution: "add = lambda a, b: a + b\nprint(add(4, 9))", expectedOutput: "13" }],
    quiz: [
      { q: "What keyword defines a lambda?", options: ["func", "lambda", "def", "anon"], correct: 1 },
      { q: "Can a lambda contain multiple statements?", options: ["Yes, any number", "No, only a single expression", "Only two", "Only with semicolons"], correct: 1 },
      { q: "What does (lambda x: x+1)(5) return?", options: ["5", "6", "Error", "x+1"], correct: 1 },
      { q: "Lambdas are most commonly used with which functions?", options: ["print, input", "map, filter, sorted", "open, close", "import, from"], correct: 1 },
      { q: "Does a lambda need a return statement?", options: ["Yes", "No, the expression's value is returned automatically", "Only if it has arguments", "Only in loops"], correct: 1 },
    ],
  },
  {
    slug: "module-5", title: "map / filter / reduce",
    theory: "map() applies a function to every item in an iterable. filter() keeps only items where a function returns True. reduce() (from functools) combines all items into one value.",
    examples: [{ code: "nums = [1,2,3,4]\nprint(list(map(lambda x: x*2, nums)))\nprint(list(filter(lambda x: x%2==0, nums)))", explanation: "map doubles every item; filter keeps only even numbers." }],
    practice: [{ prompt: "Use filter to keep only numbers greater than 10 from [5, 12, 8, 20], then print the list.", starterCode: "# write your code below\n", solution: "nums = [5, 12, 8, 20]\nresult = list(filter(lambda x: x > 10, nums))\nprint(result)", expectedOutput: "[12, 20]" }],
    quiz: [
      { q: "What does map() return in Python 3?", options: ["A list directly", "A map object (iterator)", "A tuple", "A dict"], correct: 1 },
      { q: "What does filter(lambda x: x>0, [-1,0,1,2]) keep?", options: ["[-1,0]", "[1,2]", "[0,1,2]", "[]"], correct: 1 },
      { q: "Where does reduce() come from?", options: ["Built-in, no import needed", "functools module", "itertools module", "collections module"], correct: 1 },
      { q: "What does list(map(str, [1,2,3])) return?", options: ["[1,2,3]", "['1','2','3']", "'123'", "Error"], correct: 1 },
      { q: "What's the modern, often more readable alternative to map/filter?", options: ["for loops only", "list comprehensions", "while loops", "recursion"], correct: 1 },
    ],
  },
  {
    slug: "module-6", title: "Decorators",
    theory: "A decorator wraps a function to add behavior before/after it runs, without changing its code. Defined as a function that takes a function and returns a new one, applied with @decorator_name.",
    examples: [{ code: "def shout(func):\n    def wrapper():\n        print(func().upper())\n    return wrapper\n\n@shout\ndef greet():\n    return \"hello\"\n\ngreet()", explanation: "shout wraps greet so its output prints uppercase automatically." }],
    practice: [{ prompt: "Write a decorator loud that prints the wrapped function's return value in uppercase, apply it to a function message() returning 'hi', then call message().", starterCode: "# write your code below\n", solution: "def loud(func):\n    def wrapper():\n        print(func().upper())\n    return wrapper\n\n@loud\ndef message():\n    return \"hi\"\n\nmessage()", expectedOutput: "HI" }],
    quiz: [
      { q: "What symbol applies a decorator to a function?", options: ["#", "@", "$", "&"], correct: 1 },
      { q: "What does a decorator function typically return?", options: ["A string", "A new (wrapper) function", "None", "A class"], correct: 1 },
      { q: "Decorators are used to add behavior...", options: ["by rewriting the original function's code", "without modifying the original function's code", "only inside classes", "only at import time"], correct: 1 },
      { q: "Can you stack multiple decorators on one function?", options: ["No", "Yes, one after another", "Only two max", "Only with classes"], correct: 1 },
      { q: "What does @staticmethod do inside a class?", options: ["Adds logging", "Marks a method that doesn't access instance data", "Deletes the method", "Makes it private"], correct: 1 },
    ],
  },
  {
    slug: "module-7", title: "Generators & yield",
    theory: "A generator function uses yield instead of return to produce a sequence of values lazily, one at a time, without storing them all in memory at once.",
    examples: [{ code: "def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nfor num in countdown(3):\n    print(num)", explanation: "Each call to next() (handled by the for loop) resumes right after the yield." }],
    practice: [{ prompt: "Write a generator squares_up_to(n) that yields squares from 1 to n, then print each from squares_up_to(4).", starterCode: "# write your code below\n", solution: "def squares_up_to(n):\n    for i in range(1, n+1):\n        yield i*i\n\nfor s in squares_up_to(4):\n    print(s)", expectedOutput: "1\n4\n9\n16" }],
    quiz: [
      { q: "Which keyword makes a function a generator?", options: ["return", "yield", "gen", "async"], correct: 1 },
      { q: "What's the main advantage of a generator over a list?", options: ["Faster sorting", "Produces values lazily, saving memory", "Always shorter code", "Automatic type conversion"], correct: 1 },
      { q: "What does calling a generator function immediately do?", options: ["Runs all the code right away", "Returns a generator object without running the body yet", "Raises an error", "Returns a list"], correct: 1 },
      { q: "How do you get the next value from a generator manually?", options: ["generator.get()", "next(generator)", "generator[0]", "generator.pop()"], correct: 1 },
      { q: "Can a generator function have multiple yield statements?", options: ["No, only one", "Yes", "Only inside a loop", "Only with return"], correct: 1 },
    ],
  },
  {
    slug: "module-8", title: "Classes & Objects (OOP Basics)",
    theory: "A class is a blueprint for creating objects, bundling data (attributes) and behavior (methods) together. Create an object by calling the class like a function.",
    examples: [{ code: "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        print(self.name + \" says woof!\")\n\nd = Dog(\"Rex\")\nd.bark()", explanation: "__init__ runs on creation, storing name on the object; bark() uses it." }],
    practice: [{ prompt: "Create a class Car with an __init__ that stores model, and a method info() that prints the model. Create a Car('Tesla') and call info().", starterCode: "# write your code below\n", solution: "class Car:\n    def __init__(self, model):\n        self.model = model\n    def info(self):\n        print(self.model)\n\nc = Car('Tesla')\nc.info()", expectedOutput: "Tesla" }],
    quiz: [
      { q: "What does self refer to inside a method?", options: ["The class itself", "The specific object the method was called on", "A global variable", "Nothing, it's optional"], correct: 1 },
      { q: "Which method runs automatically when an object is created?", options: ["__start__", "__init__", "__new__", "__create__"], correct: 1 },
      { q: "How do you create an object from class Dog?", options: ["new Dog()", "Dog.create()", "Dog()", "make Dog"], correct: 2 },
      { q: "What is stored inside self.name = name?", options: ["A local variable only", "An attribute on the object", "A class-wide constant", "Nothing, it's invalid"], correct: 1 },
      { q: "What term describes a function defined inside a class?", options: ["Attribute", "Method", "Module", "Constructor only"], correct: 1 },
    ],
  },
  {
    slug: "module-9", title: "Inheritance",
    theory: "Inheritance lets a class (child) reuse and extend the attributes/methods of another class (parent), avoiding duplicate code for related types.",
    examples: [{ code: "class Animal:\n    def speak(self):\n        print(\"...\")\n\nclass Cat(Animal):\n    def speak(self):\n        print(\"Meow\")\n\nCat().speak()", explanation: "Cat inherits from Animal and overrides speak() with its own version." }],
    practice: [{ prompt: "Create a class Shape with method describe() printing 'A shape'. Create Circle(Shape) overriding describe() to print 'A circle'. Call describe() on a Circle.", starterCode: "# write your code below\n", solution: "class Shape:\n    def describe(self):\n        print('A shape')\n\nclass Circle(Shape):\n    def describe(self):\n        print('A circle')\n\nCircle().describe()", expectedOutput: "A circle" }],
    quiz: [
      { q: "What is the class being inherited from called?", options: ["Child class", "Parent/base class", "Subclass", "Instance"], correct: 1 },
      { q: "How does a class inherit from another?", options: ["class Child(Parent):", "class Child inherits Parent:", "class Child extends Parent:", "class Child : Parent"], correct: 0 },
      { q: "What is it called when a child class redefines a parent's method?", options: ["Overloading", "Overriding", "Inheriting", "Encapsulation"], correct: 1 },
      { q: "How can a child call its parent's version of a method?", options: ["parent.method()", "super().method()", "self.parent_method()", "base.method()"], correct: 1 },
      { q: "Can a class inherit from multiple parent classes in Python?", options: ["No, never", "Yes, multiple inheritance is supported", "Only with decorators", "Only built-in classes"], correct: 1 },
    ],
  },
  {
    slug: "module-10", title: "Magic Methods (__init__, __str__, etc.)",
    theory: "Magic (dunder) methods let objects work with Python's built-in syntax — __str__ controls print() output, __len__ controls len(), __eq__ controls ==, and so on.",
    examples: [{ code: "class Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __str__(self):\n        return f\"({self.x}, {self.y})\"\n\nprint(Point(2, 3))", explanation: "__str__ defines what print() shows for a Point object." }],
    practice: [{ prompt: "Create class Box with __init__(self, items) storing items, and __len__ returning len(items). Print len(Box([1,2,3])).", starterCode: "# write your code below\n", solution: "class Box:\n    def __init__(self, items):\n        self.items = items\n    def __len__(self):\n        return len(self.items)\n\nprint(len(Box([1,2,3])))", expectedOutput: "3" }],
    quiz: [
      { q: "Which magic method controls what print(obj) displays?", options: ["__print__", "__str__", "__display__", "__repr__ only"], correct: 1 },
      { q: "Which magic method lets len(obj) work on a custom class?", options: ["__length__", "__len__", "__size__", "__count__"], correct: 1 },
      { q: "Which magic method defines behavior for == comparisons?", options: ["__equals__", "__eq__", "__compare__", "__is__"], correct: 1 },
      { q: "What does __init__ do?", options: ["Deletes an object", "Initializes a new object's attributes", "Compares two objects", "Converts to string"], correct: 1 },
      { q: "Are magic methods also called?", options: ["Private methods", "Dunder methods (double underscore)", "Static methods", "Abstract methods"], correct: 1 },
    ],
  },
  {
    slug: "module-11", title: "Exception Hierarchies (Custom Exceptions)",
    theory: "You can define your own exception types by subclassing Exception (or a more specific built-in exception), giving you precise, meaningful errors for your program's logic.",
    examples: [{ code: "class InsufficientFundsError(Exception):\n    pass\n\ndef withdraw(balance, amount):\n    if amount > balance:\n        raise InsufficientFundsError(\"Not enough funds\")\n    return balance - amount\n\ntry:\n    withdraw(50, 100)\nexcept InsufficientFundsError as e:\n    print(e)", explanation: "Raises and catches a custom exception with a clear, specific name." }],
    practice: [{ prompt: "Define class NegativeAgeError(Exception). Write check_age(age) that raises it if age < 0. Call check_age(-5) inside try/except printing the error message.", starterCode: "# write your code below\n", solution: "class NegativeAgeError(Exception):\n    pass\n\ndef check_age(age):\n    if age < 0:\n        raise NegativeAgeError(\"Age cannot be negative\")\n\ntry:\n    check_age(-5)\nexcept NegativeAgeError as e:\n    print(e)", expectedOutput: "Age cannot be negative" }],
    quiz: [
      { q: "What do custom exceptions typically inherit from?", options: ["object only", "Exception (or a subclass of it)", "BaseException always required directly", "Error"], correct: 1 },
      { q: "How do you trigger an exception manually?", options: ["throw", "raise", "except", "error()"], correct: 1 },
      { q: "Why create custom exceptions instead of using generic ones?", options: ["They run faster", "They give clearer, more specific error meaning", "Python requires it", "They prevent all bugs"], correct: 1 },
      { q: "What does 'as e' do in except SomeError as e:?", options: ["Renames the exception class", "Binds the exception instance to variable e", "Creates a new exception", "Nothing, it's optional syntax only"], correct: 1 },
      { q: "Can you catch a custom exception's parent class instead of the exact type?", options: ["No", "Yes, since it inherits from that parent", "Only with finally", "Only for built-in exceptions"], correct: 1 },
    ],
  },
  {
    slug: "module-12", title: "Context Managers (with statement, custom)",
    theory: "The with statement ensures setup and cleanup happen automatically (like closing a file). You can build your own context manager using __enter__ and __exit__.",
    examples: [{ code: "class Timer:\n    def __enter__(self):\n        print(\"Starting\")\n        return self\n    def __exit__(self, *args):\n        print(\"Done\")\n\nwith Timer():\n    print(\"Working...\")", explanation: "__enter__ runs on entry, __exit__ runs automatically on exit, even if an error occurs inside." }],
    practice: [{ prompt: "Create a class Logger with __enter__ printing 'OPEN' and __exit__ printing 'CLOSE'. Use it in a with block printing 'middle' in between.", starterCode: "# write your code below\n", solution: "class Logger:\n    def __enter__(self):\n        print('OPEN')\n    def __exit__(self, *args):\n        print('CLOSE')\n\nwith Logger():\n    print('middle')", expectedOutput: "OPEN\nmiddle\nCLOSE" }],
    quiz: [
      { q: "Which method runs when entering a with block?", options: ["__start__", "__enter__", "__open__", "__begin__"], correct: 1 },
      { q: "Which method runs when leaving a with block (even on error)?", options: ["__close__", "__exit__", "__end__", "__finally__"], correct: 1 },
      { q: "What's a common built-in example of a context manager?", options: ["print()", "open() used with 'with'", "range()", "len()"], correct: 1 },
      { q: "What's the main benefit of using with over manual open()/close()?", options: ["Faster execution", "Guarantees cleanup even if an error occurs", "Uses less memory always", "Required by Python syntax"], correct: 1 },
      { q: "Can a class-based context manager return a value used inside the with block?", options: ["No", "Yes, via __enter__'s return value", "Only via __exit__", "Only with generators"], correct: 1 },
    ],
  },
  {
    slug: "module-13", title: "Working with JSON",
    theory: "The json module converts between Python objects and JSON text — json.dumps() turns Python into a JSON string, json.loads() parses JSON text back into Python.",
    examples: [{ code: 'import json\ndata = {"name": "Ann", "age": 20}\ntext = json.dumps(data)\nprint(text)', explanation: "Converts a Python dict into a JSON-formatted string." }],
    practice: [{ prompt: "Parse the JSON string '{\"score\": 95}' with json.loads and print the score value.", starterCode: "import json\n# write your code below\n", solution: 'raw = \'{"score": 95}\'\ndata = json.loads(raw)\nprint(data["score"])', expectedOutput: "95" }],
    quiz: [
      { q: "Which function converts a Python dict to a JSON string?", options: ["json.loads()", "json.dumps()", "json.parse()", "json.encode()"], correct: 1 },
      { q: "Which function converts a JSON string into a Python object?", options: ["json.loads()", "json.dumps()", "json.read()", "json.decode()"], correct: 0 },
      { q: "What Python type does a JSON object become?", options: ["list", "dict", "tuple", "set"], correct: 1 },
      { q: "What module must you import to work with JSON?", options: ["json", "jsonlib", "pyjson", "data"], correct: 0 },
      { q: "What Python type does a JSON array become?", options: ["dict", "list", "tuple", "set"], correct: 1 },
    ],
  },
  {
    slug: "module-14", title: "Working with CSV",
    theory: "The csv module reads and writes CSV (comma-separated values) files, commonly used for spreadsheet-style tabular data.",
    examples: [{ code: "import csv\nwith open('data.csv', 'w', newline='') as f:\n    writer = csv.writer(f)\n    writer.writerow(['name', 'age'])\n    writer.writerow(['Ann', 20])", explanation: "Writes two rows into a CSV file using the csv module's writer." }],
    practice: [{ prompt: "Write a list of rows [['a','b'],['1','2']] to a file rows.csv using csv.writer, then print 'Saved'.", starterCode: "import csv\n# write your code below\n", solution: "with open('rows.csv', 'w', newline='') as f:\n    writer = csv.writer(f)\n    writer.writerows([['a','b'],['1','2']])\nprint('Saved')", expectedOutput: "Saved" }],
    quiz: [
      { q: "Which module handles CSV files in Python's standard library?", options: ["csv", "pandas", "table", "sheet"], correct: 0 },
      { q: "Which method writes a single row to a CSV file?", options: [".write_row()", ".writerow()", ".add_row()", ".append()"], correct: 1 },
      { q: "Which method writes multiple rows at once?", options: [".writerows()", ".writeall()", ".writemany()", ".bulk_write()"], correct: 0 },
      { q: "What does csv.reader() return when iterated?", options: ["Each row as a list of strings", "A single string", "A dictionary", "Column names only"], correct: 0 },
      { q: "What's a common reason to set newline='' when opening a CSV for writing?", options: ["Required syntax with no real effect", "Prevents extra blank lines on some platforms", "Speeds up writing", "Adds headers automatically"], correct: 1 },
    ],
  },
  {
    slug: "module-15", title: "Regular Expressions",
    theory: "The re module lets you search, match, and manipulate text using patterns. Common functions: re.search(), re.match(), re.findall(), re.sub().",
    examples: [{ code: "import re\ntext = \"My number is 12345\"\nmatch = re.search(r'\\d+', text)\nprint(match.group())", explanation: "Finds the first sequence of digits in the string using a regex pattern." }],
    practice: [{ prompt: "Use re.findall to find all words in 'cat dog cat bird cat' and print how many times 'cat' appears using .count().", starterCode: "import re\n# write your code below\n", solution: "text = 'cat dog cat bird cat'\nwords = re.findall(r'\\w+', text)\nprint(words.count('cat'))", expectedOutput: "3" }],
    quiz: [
      { q: "Which module provides regular expression support?", options: ["regex", "re", "pattern", "match"], correct: 1 },
      { q: "What does \\d match in a regex pattern?", options: ["Any letter", "Any digit", "Whitespace", "Any character"], correct: 1 },
      { q: "Which function finds all matches of a pattern in a string?", options: ["re.search()", "re.findall()", "re.match()", "re.first()"], correct: 1 },
      { q: "What does re.sub() do?", options: ["Searches only", "Substitutes matched text with a replacement", "Splits a string", "Counts matches"], correct: 1 },
      { q: "What does the + quantifier mean in a regex pattern?", options: ["Zero or more", "One or more", "Exactly one", "Optional"], correct: 1 },
    ],
  },
  {
    slug: "module-16", title: "Datetime Module",
    theory: "The datetime module represents dates and times as objects, letting you compute differences, format output, and get the current moment.",
    examples: [{ code: "from datetime import datetime\nnow = datetime.now()\nprint(now.year)", explanation: "Gets the current date/time and reads just the year." }],
    practice: [{ prompt: "Create a datetime for 2024-01-01 using datetime(2024,1,1) and print its .year.", starterCode: "from datetime import datetime\n# write your code below\n", solution: "d = datetime(2024, 1, 1)\nprint(d.year)", expectedOutput: "2024" }],
    quiz: [
      { q: "Which module provides date and time objects?", options: ["time", "datetime", "calendar", "clock"], correct: 1 },
      { q: "Which function gets the current date and time?", options: ["datetime.today()", "datetime.now()", "Both A and B work", "datetime.current()"], correct: 2 },
      { q: "What does subtracting two datetime objects return?", options: ["An int", "A timedelta object", "A string", "Error"], correct: 1 },
      { q: "How do you format a datetime as a string?", options: [".format()", ".strftime()", ".toString()", ".display()"], correct: 1 },
      { q: "What attribute gets just the month from a datetime object?", options: [".getMonth()", ".month", ".Month()", "month(date)"], correct: 1 },
    ],
  },
  {
    slug: "module-17", title: "Iterators & Iterables",
    theory: "An iterable is anything you can loop over (lists, strings, dicts). An iterator is the object that actually produces items one at a time via __next__, obtained by calling iter() on an iterable.",
    examples: [{ code: "nums = [1, 2, 3]\nit = iter(nums)\nprint(next(it))\nprint(next(it))", explanation: "iter() creates an iterator; each next() call gives the next value." }],
    practice: [{ prompt: "Create an iterator from the list ['a','b','c'] and print the first two values using next().", starterCode: "# write your code below\n", solution: "letters = ['a','b','c']\nit = iter(letters)\nprint(next(it))\nprint(next(it))", expectedOutput: "a\nb" }],
    quiz: [
      { q: "What function converts an iterable into an iterator?", options: ["next()", "iter()", "list()", "loop()"], correct: 1 },
      { q: "What does calling next() on an exhausted iterator raise?", options: ["ValueError", "StopIteration", "IndexError", "TypeError"], correct: 1 },
      { q: "Is every iterable also an iterator?", options: ["Yes, always", "No — an iterable must be converted via iter() first", "Only lists are", "Only strings are"], correct: 1 },
      { q: "Which method must an iterator implement to produce values?", options: ["__get__", "__next__", "__value__", "__yield__"], correct: 1 },
      { q: "Do generators count as iterators?", options: ["No", "Yes, they implement the iterator protocol", "Only if using return", "Only in classes"], correct: 1 },
    ],
  },
  {
    slug: "module-18", title: "Comprehension Variants (Dict/Set)",
    theory: "Beyond list comprehensions, Python supports dict comprehensions {k: v for ...} and set comprehensions {x for ...}, built the same way but producing different collection types.",
    examples: [{ code: "squares = {n: n**2 for n in range(4)}\nprint(squares)", explanation: "Builds {0:0, 1:1, 2:4, 3:9} — a dict comprehension mapping n to its square." }],
    practice: [{ prompt: "Build a set comprehension of the remainders when 1-6 are divided by 3, then print it sorted as a list.", starterCode: "# write your code below\n", solution: "remainders = {n % 3 for n in range(1, 7)}\nprint(sorted(remainders))", expectedOutput: "[0, 1, 2]" }],
    quiz: [
      { q: "Which brackets create a dict comprehension?", options: ["[]", "()", "{} with key:value", "<>"], correct: 2 },
      { q: "What does {x for x in [1,1,2,2,3]} produce?", options: ["[1,1,2,2,3]", "{1,2,3}", "(1,2,3)", "Error"], correct: 1 },
      { q: "What does {k: len(k) for k in ['a','bb']} produce?", options: ["{'a':1, 'bb':2}", "['a','bb']", "{1:'a', 2:'bb'}", "Error"], correct: 0 },
      { q: "Do comprehensions support an if condition like list comprehensions?", options: ["No, only list comprehensions can filter", "Yes, all comprehension types support filtering", "Only dict comprehensions can", "Only set comprehensions can"], correct: 1 },
      { q: "Set comprehensions automatically remove...", options: ["Negative numbers", "Duplicate values", "Strings", "Even numbers"], correct: 1 },
    ],
  },
  {
    slug: "module-19", title: "Unpacking & Enumerate/Zip",
    theory: "Unpacking assigns multiple variables from a sequence at once. enumerate() pairs items with their index while looping; zip() pairs items from multiple sequences together.",
    examples: [{ code: "names = ['Ann', 'Bo']\nfor i, name in enumerate(names):\n    print(i, name)", explanation: "enumerate() gives both the index and value in each loop iteration." }],
    practice: [{ prompt: "Given a=[1,2,3] and b=['x','y','z'], use zip to print each pair on its own line as 'num-letter'.", starterCode: "a = [1,2,3]\nb = ['x','y','z']\n# write your code below\n", solution: "for num, letter in zip(a, b):\n    print(f\"{num}-{letter}\")", expectedOutput: "1-x\n2-y\n3-z" }],
    quiz: [
      { q: "What does a, b = (1, 2) do?", options: ["Error, wrong syntax", "Unpacks 1 into a and 2 into b", "Creates a tuple", "Assigns (1,2) to both"], correct: 1 },
      { q: "What does enumerate(['a','b']) yield?", options: ["Just the values", "(index, value) pairs", "Just the indexes", "A dict"], correct: 1 },
      { q: "What does zip([1,2],[3,4]) produce when converted to a list?", options: ["[1,2,3,4]", "[(1,3),(2,4)]", "[(1,2),(3,4)]", "Error"], correct: 1 },
      { q: "What happens if zip() is given sequences of different lengths?", options: ["Raises an error", "Stops at the shortest sequence", "Fills missing values with None", "Repeats the shorter one"], correct: 1 },
      { q: "Which is valid: a, *rest = [1,2,3,4]. What is rest?", options: ["[2,3,4]", "[1,2,3,4]", "4", "Error"], correct: 0 },
    ],
  },
  {
    slug: "module-20", title: "Intermediate Capstone Project",
    theory: "Time to combine intermediate concepts — classes, comprehensions, decorators, error handling, and file/data work — into one cohesive program. This is your final challenge before the Intermediate certification exam.",
    examples: [{ code: "class Inventory:\n    def __init__(self):\n        self.items = {}\n    def add(self, name, qty):\n        self.items[name] = self.items.get(name, 0) + qty\n\ninv = Inventory()\ninv.add('apple', 3)\ninv.add('apple', 2)\nprint(inv.items['apple'])", explanation: "Combines a class, a dict, and .get() with a default to accumulate quantities." }],
    practice: [{ prompt: "Create class Cart with __init__ storing an empty list, method add(item) appending to it, and method total() returning len(items). Add 3 items and print total().", starterCode: "# write your code below\n", solution: "class Cart:\n    def __init__(self):\n        self.items = []\n    def add(self, item):\n        self.items.append(item)\n    def total(self):\n        return len(self.items)\n\nc = Cart()\nc.add('a')\nc.add('b')\nc.add('c')\nprint(c.total())", expectedOutput: "3" }],
    quiz: [
      { q: "What's a sign that intermediate OOP + data-handling skills are combining well?", options: ["Using only print statements", "Classes managing structured data with clear methods", "Avoiding functions entirely", "Writing everything in one line"], correct: 1 },
      { q: "What should you reach for when a task might fail (file I/O, parsing)?", options: ["Ignore it", "try/except with a specific exception type", "A global variable", "Nothing, Python auto-handles it"], correct: 1 },
      { q: "Which is a good reason to define a custom exception in a larger project?", options: ["It's required by Python", "It communicates a specific failure clearly to callers", "It makes code slower", "It replaces all other exceptions"], correct: 1 },
      { q: "What does finishing this capstone unlock?", options: ["Nothing", "Access to the Python Intermediate certification exam", "The beginner certificate", "Advanced Python automatically, no exam needed"], correct: 1 },
      { q: "What's the benefit of comprehensions and generators in larger programs?", options: ["They make code slower but shorter", "Concise, often more memory-efficient data processing", "They replace all functions", "They are required for classes to work"], correct: 1 },
    ],
  },
];

// 25-question final certification exam — gates the Python Intermediate certificate.
// Stored as its own module ("final-exam") with a single level ("certification-quiz").
const FINAL_EXAM_QUESTIONS = [
  { q: "What does [x for x in range(5) if x % 2 == 0] return?", options: ["[0,2,4]", "[1,3]", "[0,1,2,3,4]", "Error"], correct: 0 },
  { q: "What type does a dict comprehension produce?", options: ["list", "dict", "set", "tuple"], correct: 1 },
  { q: "What does *args collect into?", options: ["dict", "tuple", "set", "list"], correct: 1 },
  { q: "What does **kwargs collect into?", options: ["tuple", "dict", "list", "set"], correct: 1 },
  { q: "A lambda can contain how many expressions?", options: ["Unlimited", "Exactly one", "Two", "Zero"], correct: 1 },
  { q: "What does map() return in Python 3?", options: ["A list", "An iterator (map object)", "A dict", "A tuple"], correct: 1 },
  { q: "What symbol applies a decorator?", options: ["#", "@", "%", "&"], correct: 1 },
  { q: "What keyword makes a function a generator?", options: ["return", "yield", "gen", "async"], correct: 1 },
  { q: "What does calling a generator function return immediately?", options: ["A list of all values", "A generator object", "None", "An error"], correct: 1 },
  { q: "What does self represent in a method?", options: ["The class", "The specific object instance", "A global variable", "Nothing"], correct: 1 },
  { q: "Which method runs automatically on object creation?", options: ["__init__", "__new__", "__create__", "__start__"], correct: 0 },
  { q: "What is method overriding?", options: ["Calling a method twice", "A child class redefining a parent's method", "Deleting a method", "Renaming a variable"], correct: 1 },
  { q: "How does a child class call its parent's method?", options: ["parent.method()", "super().method()", "self.parent()", "base.method()"], correct: 1 },
  { q: "Which magic method controls what print(obj) shows?", options: ["__print__", "__str__", "__display__", "__out__"], correct: 1 },
  { q: "What should custom exceptions typically inherit from?", options: ["object", "Exception", "BaseException only", "Error"], correct: 1 },
  { q: "Which keyword manually triggers an exception?", options: ["throw", "raise", "error", "except"], correct: 1 },
  { q: "Which method runs when entering a with block?", options: ["__enter__", "__start__", "__open__", "__with__"], correct: 0 },
  { q: "Which method runs when leaving a with block?", options: ["__close__", "__exit__", "__end__", "__done__"], correct: 1 },
  { q: "Which function converts a Python dict to a JSON string?", options: ["json.loads()", "json.dumps()", "json.parse()", "json.stringify()"], correct: 1 },
  { q: "Which module handles CSV file reading/writing?", options: ["csv", "pandas", "table", "data"], correct: 0 },
  { q: "What does \\d match in a regex?", options: ["Any letter", "Any digit", "Whitespace", "Any symbol"], correct: 1 },
  { q: "Which function gets the current date and time?", options: ["datetime.now()", "datetime.today()", "Both work", "time.current()"], correct: 2 },
  { q: "What does iter() do to a list?", options: ["Sorts it", "Converts it into an iterator", "Empties it", "Copies it"], correct: 1 },
  { q: "What does enumerate(['a','b']) yield per iteration?", options: ["Just values", "(index, value) pairs", "Just indexes", "Errors"], correct: 1 },
  { q: "What happens when zip() receives sequences of unequal length?", options: ["Raises an error", "Stops at the shortest one", "Pads with None", "Repeats the shortest"], correct: 1 },
];

async function main() {
  // Ensure the python-intermediate language exists (create if this is the first run).
  let language = await prisma.language.findUnique({ where: { slug: "python-intermediate" } });
  if (!language) {
    const beginner = await prisma.language.findUnique({ where: { slug: "python" } });
    language = await prisma.language.create({
      data: {
        slug: "python-intermediate",
        name: "Python — Intermediate",
        description: "Level up with OOP, decorators, generators, and real-world data handling.",
        icon: "🐍",
        difficulty: "Intermediate",
        order: beginner ? beginner.order + 1 : 100,
      },
    });
    console.log("Created language: python-intermediate");
  }

  for (let i = 0; i < PYTHON_INTERMEDIATE_MODULES.length; i++) {
    const m = PYTHON_INTERMEDIATE_MODULES[i];

    const mod = await prisma.module.upsert({
      where: { languageId_slug: { languageId: language.id, slug: m.slug } },
      update: { title: m.title, order: i + 1 },
      create: { languageId: language.id, slug: m.slug, title: m.title, order: i + 1 },
    });

    const level = await prisma.level.upsert({
      where: { moduleId_slug: { moduleId: mod.id, slug: "level-1" } },
      update: {
        title: m.title,
        theory: m.theory,
        examples: m.examples,
        practice: m.practice,
        xpReward: 60,
      },
      create: {
        moduleId: mod.id,
        slug: "level-1",
        title: m.title,
        order: 1,
        theory: m.theory,
        examples: m.examples,
        practice: m.practice,
        xpReward: 60,
      },
    });

    const existingQ = await prisma.question.count({ where: { levelId: level.id } });
    if (existingQ === 0) {
      for (let qi = 0; qi < m.quiz.length; qi++) {
        const q = m.quiz[qi];
        await prisma.question.create({
          data: {
            levelId: level.id,
            question: q.q,
            options: q.options,
            correctIndex: q.correct,
            order: qi,
          },
        });
      }
    }

    console.log(`Seeded ${m.slug}: ${m.title} (${m.quiz.length} quiz questions)`);
  }

  // ---- Final 25-question certification exam ----
  const examModule = await prisma.module.upsert({
    where: { languageId_slug: { languageId: language.id, slug: "final-exam" } },
    update: { title: "Certification Exam", order: PYTHON_INTERMEDIATE_MODULES.length + 1 },
    create: {
      languageId: language.id,
      slug: "final-exam",
      title: "Certification Exam",
      order: PYTHON_INTERMEDIATE_MODULES.length + 1,
    },
  });

  const examLevel = await prisma.level.upsert({
    where: { moduleId_slug: { moduleId: examModule.id, slug: "certification-quiz" } },
    update: {
      title: "Python Intermediate — Certification Exam",
      theory: "A 25-question exam covering every topic from this track. Score 80% or higher (20/25) to earn your Python Intermediate certificate.",
      examples: [],
      practice: [],
      xpReward: 200,
    },
    create: {
      moduleId: examModule.id,
      slug: "certification-quiz",
      title: "Python Intermediate — Certification Exam",
      order: 1,
      theory: "A 25-question exam covering every topic from this track. Score 80% or higher (20/25) to earn your Python Intermediate certificate.",
      examples: [],
      practice: [],
      xpReward: 200,
    },
  });

  const existingExamQ = await prisma.question.count({ where: { levelId: examLevel.id } });
  if (existingExamQ === 0) {
    for (let qi = 0; qi < FINAL_EXAM_QUESTIONS.length; qi++) {
      const q = FINAL_EXAM_QUESTIONS[qi];
      await prisma.question.create({
        data: {
          levelId: examLevel.id,
          question: q.q,
          options: q.options,
          correctIndex: q.correct,
          order: qi,
        },
      });
    }
  }

  console.log(`Seeded final-exam: Certification Exam (${FINAL_EXAM_QUESTIONS.length} quiz questions)`);
  console.log(`\nDone — seeded all ${PYTHON_INTERMEDIATE_MODULES.length} modules + final exam for python-intermediate.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());