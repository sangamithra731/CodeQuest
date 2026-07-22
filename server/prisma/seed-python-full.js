const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PYTHON_MODULES = [
  {
    slug: "module-1", title: "Setting Up & Your First Print",
    theory: "Python reads code top to bottom. The print() function is how you make the computer show something on screen — put whatever you want displayed inside the parentheses.",
    examples: [{ code: 'print("Hello, world!")', explanation: "Displays the text exactly as written." }],
    practice: [{ prompt: "Print: Hello, CodeQuest!", starterCode: "# write your code below\n", solution: 'print("Hello, CodeQuest!")', expectedOutput: "Hello, CodeQuest!" }],
    quiz: [
      { q: "Which function displays text in Python?", options: ["show()", "print()", "echo()", "display()"], correct: 1 },
      { q: "What does print(\"5\" + \"3\") output?", options: ["8", "53", "Error", "15"], correct: 1 },
      { q: "How do you start a single-line comment?", options: ["//", "<!--", "#", "/*"], correct: 2 },
      { q: "Which is a valid variable name?", options: ["2cool", "my-var", "my_var", "my var"], correct: 2 },
      { q: "What type is the value \"Hello\"?", options: ["Integer", "Boolean", "String", "Float"], correct: 2 },
    ],
  },
  {
    slug: "module-2", title: "Variables & Data Types",
    theory: "A variable is a labeled box that stores a value. Python figures out the type automatically — no need to declare it. Core types: int, float, str, bool.",
    examples: [{ code: 'age = 16\nname = "Asha"\nis_student = True', explanation: "Three variables, three different types, no type keyword needed." }],
    practice: [{ prompt: "Create a variable city and assign your city's name to it, then print it.", starterCode: "# write your code below\n", solution: 'city = "Coimbatore"\nprint(city)', expectedOutput: "Coimbatore" }],
    quiz: [
      { q: "Which keyword declares a variable's type in Python?", options: ["var", "let", "type", "None — Python infers it"], correct: 3 },
      { q: "What is the type of True?", options: ["str", "int", "bool", "float"], correct: 2 },
      { q: "What does type(3.14) return?", options: ["int", "float", "str", "double"], correct: 1 },
      { q: "Which is a valid way to assign multiple variables at once?", options: ["a, b = 1, 2", "a = b = , 1 2", "a & b = 1 & 2", "set(a=1, b=2)"], correct: 0 },
      { q: "What does x = None mean?", options: ["x is zero", "x holds no value", "x is undefined syntax error", "x is a string"], correct: 1 },
    ],
  },
  {
    slug: "module-3", title: "Numbers & Operators",
    theory: "Python supports the usual math operators (+ - * /), plus // for floor division, % for remainder, and ** for exponents.",
    examples: [{ code: "print(7 // 2)  # 3\nprint(7 % 2)   # 1\nprint(2 ** 5)  # 32", explanation: "Floor division drops the decimal, % gives the remainder, ** raises to a power." }],
    practice: [{ prompt: "Print the remainder when 17 is divided by 5.", starterCode: "# write your code below\n", solution: "print(17 % 5)", expectedOutput: "2" }],
    quiz: [
      { q: "What does 10 // 3 return?", options: ["3.33", "3", "1", "4"], correct: 1 },
      { q: "What does 2 ** 3 return?", options: ["6", "8", "9", "5"], correct: 1 },
      { q: "What does 10 % 3 return?", options: ["3", "1", "0", "10"], correct: 1 },
      { q: "What is the result of 5 / 2 in Python 3?", options: ["2", "2.5", "2.0", "Error"], correct: 1 },
      { q: "Which operator has the highest precedence?", options: ["+", "*", "**", "%"], correct: 2 },
    ],
  },
  {
    slug: "module-4", title: "Strings & String Methods",
    theory: "Strings are sequences of characters. Useful built-in methods: .upper(), .lower(), .strip(), .replace(), .split().",
    examples: [{ code: 'text = "  Hello World  "\nprint(text.strip().lower())', explanation: "Removes leading/trailing spaces, then lowercases." }],
    practice: [{ prompt: "Given word = \"python\", print it in uppercase.", starterCode: 'word = "python"\n# write your code below\n', solution: "print(word.upper())", expectedOutput: "PYTHON" }],
    quiz: [
      { q: "What does \"hi\".upper() return?", options: ["hi", "HI", "Hi", "Error"], correct: 1 },
      { q: "What does \"a,b,c\".split(\",\") return?", options: ["\"a,b,c\"", "['a','b','c']", "'a b c'", "Error"], correct: 1 },
      { q: "What does len(\"hello\") return?", options: ["4", "5", "6", "Error"], correct: 1 },
      { q: "How do you check if \"py\" is inside \"python\"?", options: ["\"py\" in \"python\"", "\"python\".contains(\"py\")", "has(\"py\", \"python\")", "\"py\".find_in(\"python\")"], correct: 0 },
      { q: "What does \"ab\" * 3 produce?", options: ["ababab", "Error", "a3b3", "ab3"], correct: 0 },
    ],
  },
  {
    slug: "module-5", title: "Input & Type Casting",
    theory: "input() always returns a string, even if the user types a number. Use int() or float() to convert it before doing math.",
    examples: [{ code: 'age = int(input("Enter your age: "))\nprint(age + 1)', explanation: "Converts the string input into an integer before adding." }],
    practice: [{ prompt: "Convert the string \"42\" into an integer and print it plus 8.", starterCode: "# write your code below\n", solution: 'num = int("42")\nprint(num + 8)', expectedOutput: "50" }],
    quiz: [
      { q: "What type does input() always return?", options: ["int", "float", "str", "depends on input"], correct: 2 },
      { q: "What does int(\"7\") + 3 return?", options: ["\"73\"", "10", "Error", "7.3"], correct: 1 },
      { q: "What does float(\"3.5\") return?", options: ["3", "3.5", "\"3.5\"", "Error"], correct: 1 },
      { q: "What happens with int(\"abc\")?", options: ["Returns 0", "Returns None", "Raises ValueError", "Returns \"abc\""], correct: 2 },
      { q: "What does str(25) return?", options: ["25", "\"25\"", "25.0", "Error"], correct: 1 },
    ],
  },
  {
    slug: "module-6", title: "Conditionals — if / elif / else",
    theory: "Conditionals let your program make decisions. Python checks each condition top to bottom and runs the first one that's true.",
    examples: [{ code: 'age = 15\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")', explanation: "Prints 'Minor' since 15 is less than 18." }],
    practice: [{ prompt: "Given score = 85, print \"Pass\" if score >= 40, else \"Fail\".", starterCode: "score = 85\n# write your code below\n", solution: 'if score >= 40:\n    print("Pass")\nelse:\n    print("Fail")', expectedOutput: "Pass" }],
    quiz: [
      { q: "Which keyword checks an additional condition after if?", options: ["else if", "elif", "elseif", "elsif"], correct: 1 },
      { q: "What does == check?", options: ["Assignment", "Equality", "Type only", "Identity"], correct: 1 },
      { q: "What runs if no condition is true and there's an else?", options: ["Nothing", "The else block", "An error", "The first if block"], correct: 1 },
      { q: "Which is the correct syntax?", options: ["if x = 5:", "if x == 5:", "if (x == 5)", "if x == 5 then"], correct: 1 },
      { q: "What does not True evaluate to?", options: ["True", "False", "None", "Error"], correct: 1 },
    ],
  },
  {
    slug: "module-7", title: "Loops — for",
    theory: "A for loop repeats code for each item in a sequence. range(n) generates numbers from 0 up to (not including) n.",
    examples: [{ code: "for i in range(5):\n    print(i)", explanation: "Prints 0, 1, 2, 3, 4 — one per line." }],
    practice: [{ prompt: "Print numbers 1 through 5 using a for loop.", starterCode: "# write your code below\n", solution: "for i in range(1, 6):\n    print(i)", expectedOutput: "1\n2\n3\n4\n5" }],
    quiz: [
      { q: "What does range(3) generate?", options: ["1,2,3", "0,1,2", "0,1,2,3", "1,2"], correct: 1 },
      { q: "How many times does 'for i in range(4):' run?", options: ["3", "4", "5", "0"], correct: 1 },
      { q: "What does range(2, 5) generate?", options: ["2,3,4", "2,3,4,5", "3,4,5", "2,3"], correct: 0 },
      { q: "Which loop is best for iterating over a known list?", options: ["while", "for", "loop", "repeat"], correct: 1 },
      { q: "What does break do inside a loop?", options: ["Skips one iteration", "Exits the loop entirely", "Restarts the loop", "Pauses execution"], correct: 1 },
    ],
  },
  {
    slug: "module-8", title: "Loops — while",
    theory: "A while loop repeats as long as a condition stays true. Always make sure the condition eventually becomes false, or you get an infinite loop.",
    examples: [{ code: "count = 0\nwhile count < 3:\n    print(count)\n    count += 1", explanation: "Prints 0, 1, 2 — the loop stops once count reaches 3." }],
    practice: [{ prompt: "Print numbers 5 down to 1 using a while loop.", starterCode: "# write your code below\n", solution: "n = 5\nwhile n >= 1:\n    print(n)\n    n -= 1", expectedOutput: "5\n4\n3\n2\n1" }],
    quiz: [
      { q: "What causes an infinite loop?", options: ["A condition that's always False", "A condition that's always True", "Using range()", "Using break"], correct: 1 },
      { q: "What does continue do?", options: ["Exits the loop", "Skips to the next iteration", "Pauses the program", "Restarts from zero"], correct: 1 },
      { q: "What's the correct shorthand for count = count + 1?", options: ["count ++", "count += 1", "count =+ 1", "++count"], correct: 1 },
      { q: "When should you prefer while over for?", options: ["Iterating a fixed list", "When the number of repeats is unknown ahead of time", "Never", "Only with strings"], correct: 1 },
      { q: "What happens if the while condition is False from the start?", options: ["Runs once anyway", "Never runs", "Error", "Runs forever"], correct: 1 },
    ],
  },
  {
    slug: "module-9", title: "Lists",
    theory: "A list is an ordered, changeable collection. Access items by index starting at 0. Common methods: .append(), .remove(), .sort().",
    examples: [{ code: 'fruits = ["apple", "banana", "mango"]\nfruits.append("kiwi")\nprint(fruits[1])', explanation: "Adds kiwi to the end, then prints index 1 → banana." }],
    practice: [{ prompt: "Create a list of 3 numbers and print the sum using sum().", starterCode: "# write your code below\n", solution: "nums = [4, 8, 15]\nprint(sum(nums))", expectedOutput: "27" }],
    quiz: [
      { q: "What index is the first item in a list?", options: ["1", "0", "-1", "It depends"], correct: 1 },
      { q: "Which method adds an item to the end of a list?", options: [".add()", ".append()", ".push()", ".insert()"], correct: 1 },
      { q: "What does len([1,2,3]) return?", options: ["2", "3", "4", "Error"], correct: 1 },
      { q: "What does my_list[-1] access?", options: ["First item", "Last item", "An error", "A random item"], correct: 1 },
      { q: "Are Python lists ordered?", options: ["Yes", "No", "Only if sorted", "Only with tuples"], correct: 0 },
    ],
  },
  {
    slug: "module-10", title: "Tuples",
    theory: "A tuple is like a list but immutable — once created, it can't be changed. Use tuples for fixed collections like coordinates.",
    examples: [{ code: 'point = (3, 4)\nprint(point[0])', explanation: "Tuples use parentheses and are accessed by index just like lists." }],
    practice: [{ prompt: "Create a tuple with your favorite two colors and print the second one.", starterCode: "# write your code below\n", solution: 'colors = ("blue", "gold")\nprint(colors[1])', expectedOutput: "gold" }],
    quiz: [
      { q: "What symbol typically defines a tuple?", options: ["[]", "{}", "()", "<>"], correct: 2 },
      { q: "Can you change a tuple after creating it?", options: ["Yes, always", "No, tuples are immutable", "Only the first item", "Only with .set()"], correct: 1 },
      { q: "What does (1, 2, 3)[1] return?", options: ["1", "2", "3", "Error"], correct: 1 },
      { q: "Which is a valid single-item tuple?", options: ["(5)", "(5,)", "[5]", "{5}"], correct: 1 },
      { q: "Why use a tuple instead of a list?", options: ["Tuples are always faster to sort", "To signal the data shouldn't change", "Tuples can hold more items", "Lists can't hold numbers"], correct: 1 },
    ],
  },
  {
    slug: "module-11", title: "Dictionaries",
    theory: "A dictionary stores key–value pairs. Look up values by key instead of position — fast and readable for structured data.",
    examples: [{ code: 'student = {"name": "Ravi", "age": 16}\nprint(student["name"])', explanation: "Accesses the value paired with the key \"name\"." }],
    practice: [{ prompt: "Create a dict with keys 'title' and 'author' for a book, then print the title.", starterCode: "# write your code below\n", solution: 'book = {"title": "Python Basics", "author": "You"}\nprint(book["title"])', expectedOutput: "Python Basics" }],
    quiz: [
      { q: "How do dictionaries store data?", options: ["By index", "As key-value pairs", "As sorted lists", "As tuples only"], correct: 1 },
      { q: "How do you access a dict value safely without an error if the key is missing?", options: [".get()", "[]", ".fetch()", ".find()"], correct: 0 },
      { q: "What does {}.keys() return?", options: ["Values", "Keys", "Both", "Nothing, it errors"], correct: 1 },
      { q: "Can dictionary keys repeat?", options: ["Yes", "No, keys must be unique", "Only string keys can repeat", "Only if nested"], correct: 1 },
      { q: "What does student[\"grade\"] = \"A\" do if 'grade' doesn't exist yet?", options: ["Raises an error", "Adds a new key-value pair", "Does nothing", "Deletes the dict"], correct: 1 },
    ],
  },
  {
    slug: "module-12", title: "Sets",
    theory: "A set is an unordered collection of unique items — duplicates are automatically removed. Useful for membership checks and removing repeats.",
    examples: [{ code: "nums = {1, 2, 2, 3}\nprint(nums)", explanation: "Prints {1, 2, 3} — the duplicate 2 is dropped automatically." }],
    practice: [{ prompt: "Create a set from the list [1,1,2,3,3,3] and print its length.", starterCode: "# write your code below\n", solution: "nums = set([1,1,2,3,3,3])\nprint(len(nums))", expectedOutput: "3" }],
    quiz: [
      { q: "Do sets allow duplicate values?", options: ["Yes", "No", "Only numbers", "Only strings"], correct: 1 },
      { q: "Are sets ordered?", options: ["Yes", "No", "Only in Python 2", "Only with sort()"], correct: 1 },
      { q: "Which symbol creates a set literal?", options: ["[]", "()", "{}", "<>"], correct: 2 },
      { q: "What does {1,2} | {2,3} return (union)?", options: ["{1,2,3}", "{2}", "{1,2,2,3}", "Error"], correct: 0 },
      { q: "What does {1,2,3} & {2,3,4} return (intersection)?", options: ["{1,2,3,4}", "{2,3}", "{1,4}", "{}"], correct: 1 },
    ],
  },
  {
    slug: "module-13", title: "Functions",
    theory: "A function packages reusable code under a name. Define one with def, and call it whenever you need that behavior.",
    examples: [{ code: "def greet(name):\n    print(\"Hello, \" + name)\n\ngreet(\"Meena\")", explanation: "Defines greet(), then calls it with an argument." }],
    practice: [{ prompt: "Write a function square(n) that prints n squared, then call square(5).", starterCode: "# write your code below\n", solution: "def square(n):\n    print(n ** 2)\n\nsquare(5)", expectedOutput: "25" }],
    quiz: [
      { q: "Which keyword defines a function?", options: ["func", "def", "function", "define"], correct: 1 },
      { q: "What does a function need to be used?", options: ["Nothing, it runs automatically", "It must be called", "It runs once at import", "It must be a class"], correct: 1 },
      { q: "What are values passed into a function called?", options: ["Variables", "Arguments", "Outputs", "Modules"], correct: 1 },
      { q: "What happens if a function has no return statement?", options: ["Error", "Returns None", "Returns 0", "Returns an empty string"], correct: 1 },
      { q: "Can a function be called before it's defined in the file?", options: ["Yes, always", "No — it must be defined first", "Only in loops", "Only with import"], correct: 1 },
    ],
  },
  {
    slug: "module-14", title: "Function Arguments & Return",
    theory: "Functions can accept multiple arguments and give a value back with return. Default arguments let you skip parameters when calling.",
    examples: [{ code: "def add(a, b=10):\n    return a + b\n\nprint(add(5))", explanation: "b defaults to 10 since only one argument was passed, so it prints 15." }],
    practice: [{ prompt: "Write a function multiply(a, b) that returns a * b, then print multiply(4, 6).", starterCode: "# write your code below\n", solution: "def multiply(a, b):\n    return a * b\n\nprint(multiply(4, 6))", expectedOutput: "24" }],
    quiz: [
      { q: "What does return do?", options: ["Prints a value", "Sends a value back to the caller", "Ends the program", "Loops the function"], correct: 1 },
      { q: "What is a default argument?", options: ["A required argument", "A fallback value used if none is passed", "An error message", "A global variable"], correct: 1 },
      { q: "Can a function return multiple values?", options: ["No, only one", "Yes, as a tuple", "Only with a list", "Never"], correct: 1 },
      { q: "What does print(add(3, 4)) do if add returns 7?", options: ["Prints 'add(3,4)'", "Prints 7", "Error", "Prints nothing"], correct: 1 },
      { q: "Where do default arguments go in the parameter list?", options: ["First", "After non-default arguments", "Anywhere", "They can't be mixed with normal args"], correct: 1 },
    ],
  },
  {
    slug: "module-15", title: "Scope & Recursion",
    theory: "A variable's scope is where it can be accessed — local (inside a function) or global. Recursion is when a function calls itself to solve a smaller version of the same problem.",
    examples: [{ code: "def factorial(n):\n    if n == 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))", explanation: "Calls itself with a smaller n each time until it hits the base case." }],
    practice: [{ prompt: "Write a recursive function count_down(n) that prints n, n-1, ... down to 1.", starterCode: "# write your code below\n", solution: "def count_down(n):\n    if n < 1:\n        return\n    print(n)\n    count_down(n - 1)\n\ncount_down(5)", expectedOutput: "5\n4\n3\n2\n1" }],
    quiz: [
      { q: "What is a local variable?", options: ["Accessible everywhere", "Only accessible inside the function it's defined in", "Always global", "A constant"], correct: 1 },
      { q: "What must every recursive function have to avoid infinite recursion?", options: ["A loop", "A base case", "A return type", "A global variable"], correct: 1 },
      { q: "What happens without a base case in recursion?", options: ["It runs once", "Stack overflow / infinite calls", "It returns None", "Nothing, Python detects it automatically"], correct: 1 },
      { q: "Can a variable defined inside a function be used outside it?", options: ["Yes, always", "No, not directly", "Only if it's a number", "Only in loops"], correct: 1 },
      { q: "What does the global keyword do?", options: ["Deletes a variable", "Lets a function modify a variable outside its scope", "Creates a new function", "Ends the program"], correct: 1 },
    ],
  },
  {
    slug: "module-16", title: "String Formatting (f-strings)",
    theory: "f-strings let you embed variables directly inside a string using curly braces, prefixed with f. Cleaner than joining strings with +.",
    examples: [{ code: 'name = "Divya"\nscore = 92\nprint(f"{name} scored {score}%")', explanation: "Inserts the variable values directly into the string." }],
    practice: [{ prompt: "Given x = 7 and y = 3, print an f-string: '7 + 3 = 10'.", starterCode: "x = 7\ny = 3\n# write your code below\n", solution: 'print(f"{x} + {y} = {x + y}")', expectedOutput: "7 + 3 = 10" }],
    quiz: [
      { q: "Which prefix creates an f-string?", options: ["s\"\"", "f\"\"", "%s", "fmt\"\""], correct: 1 },
      { q: "How do you insert a variable inside an f-string?", options: ["%variable%", "{variable}", "$variable", "<variable>"], correct: 1 },
      { q: "Can you do math directly inside an f-string's braces?", options: ["No", "Yes, e.g. f\"{2+2}\"", "Only with functions", "Only integers"], correct: 1 },
      { q: "What does f\"{3.14159:.2f}\" produce?", options: ["3.14159", "3.14", "3", "Error"], correct: 1 },
      { q: "Which Python version introduced f-strings?", options: ["2.7", "3.0", "3.6", "3.11"], correct: 2 },
    ],
  },
  {
    slug: "module-17", title: "Error Handling (try/except)",
    theory: "try/except lets your program handle errors gracefully instead of crashing. Put risky code in try, and handle failures in except.",
    examples: [{ code: 'try:\n    num = int("abc")\nexcept ValueError:\n    print("That\'s not a number")', explanation: "Catches the ValueError instead of crashing the program." }],
    practice: [{ prompt: "Safely convert \"12x\" to an int, printing 'Invalid input' if it fails.", starterCode: "# write your code below\n", solution: 'try:\n    n = int("12x")\nexcept ValueError:\n    print("Invalid input")', expectedOutput: "Invalid input" }],
    quiz: [
      { q: "Which block runs if an error occurs?", options: ["try", "except", "finally only", "catch"], correct: 1 },
      { q: "What does finally guarantee?", options: ["It only runs on error", "It always runs, error or not", "It never runs", "It replaces except"], correct: 1 },
      { q: "What error type does int(\"abc\") raise?", options: ["TypeError", "ValueError", "NameError", "IndexError"], correct: 1 },
      { q: "Can you catch multiple exception types in one except?", options: ["No", "Yes, using a tuple", "Only with finally", "Only in loops"], correct: 1 },
      { q: "What happens if no exception matches the except clause?", options: ["It's silently ignored", "The error propagates up uncaught", "Python fixes it automatically", "The program restarts"], correct: 1 },
    ],
  },
  {
    slug: "module-18", title: "File Handling",
    theory: "Python can read and write files using open(). Always use 'with' so the file closes automatically, even if an error occurs.",
    examples: [{ code: 'with open("notes.txt", "w") as f:\n    f.write("Hello file!")', explanation: "Opens notes.txt in write mode and writes a line, closing it automatically." }],
    practice: [{ prompt: "Write 'CodeQuest' to a file called log.txt, then print 'Saved!' to confirm.", starterCode: "# write your code below\n", solution: 'with open("log.txt", "w") as f:\n    f.write("CodeQuest")\nprint("Saved!")', expectedOutput: "Saved!" }],
    quiz: [
      { q: "What does 'w' mode do when opening a file?", options: ["Read only", "Write, overwriting existing content", "Append", "Delete the file"], correct: 1 },
      { q: "Why use 'with' when opening files?", options: ["It's required syntax", "It auto-closes the file safely", "It makes files load faster", "It prevents typos"], correct: 1 },
      { q: "Which mode adds to a file without erasing it?", options: ["'w'", "'a'", "'r'", "'x'"], correct: 1 },
      { q: "What method reads an entire file's contents at once?", options: [".read()", ".open()", ".getAll()", ".fetch()"], correct: 0 },
      { q: "What happens if you open a file that doesn't exist in 'r' mode?", options: ["It creates it", "Raises FileNotFoundError", "Returns None", "Returns an empty string"], correct: 1 },
    ],
  },
  {
    slug: "module-19", title: "Modules & Packages",
    theory: "A module is a Python file you can import and reuse. The standard library ships with many, like math and random.",
    examples: [{ code: "import math\nprint(math.sqrt(16))", explanation: "Imports the math module and uses its sqrt function." }],
    practice: [{ prompt: "Import math and print the square root of 25.", starterCode: "# write your code below\n", solution: "import math\nprint(math.sqrt(25))", expectedOutput: "5.0" }],
    quiz: [
      { q: "Which keyword brings a module into your code?", options: ["include", "import", "require", "using"], correct: 1 },
      { q: "What does math.sqrt(9) return?", options: ["3", "3.0", "9", "81"], correct: 1 },
      { q: "How do you import just one function from a module?", options: ["import math.sqrt", "from math import sqrt", "get sqrt from math", "math.only(sqrt)"], correct: 1 },
      { q: "Which module generates random numbers?", options: ["os", "random", "sys", "time"], correct: 1 },
      { q: "What is a package in Python?", options: ["A single function", "A collection of related modules", "A type of loop", "A built-in variable"], correct: 1 },
    ],
  },
  {
    slug: "module-20", title: "Capstone — Putting It Together",
    theory: "Time to combine everything: variables, conditionals, loops, functions, and error handling into one small program. This is your final challenge for the Python track.",
    examples: [{ code: 'def grade(score):\n    if score >= 90:\n        return "A"\n    elif score >= 75:\n        return "B"\n    else:\n        return "C"\n\nfor s in [95, 80, 60]:\n    print(grade(s))', explanation: "Combines a function, conditionals, and a loop to grade a list of scores." }],
    practice: [{ prompt: "Write a function is_even(n) returning True/False, then loop through 1-5 printing each number and whether it's even.", starterCode: "# write your code below\n", solution: 'def is_even(n):\n    return n % 2 == 0\n\nfor i in range(1, 6):\n    print(i, is_even(i))', expectedOutput: "1 False\n2 True\n3 False\n4 True\n5 False" }],
    quiz: [
      { q: "Which combination of concepts does a well-structured program usually use?", options: ["Only loops", "Variables, conditionals, loops, and functions together", "Only functions", "Only print statements"], correct: 1 },
      { q: "What's good practice when a task will be repeated in your code?", options: ["Copy-paste it everywhere", "Wrap it in a function", "Avoid using it", "Use only global variables"], correct: 1 },
      { q: "What should you do around code that might fail (like user input)?", options: ["Ignore it", "Wrap it in try/except", "Delete it", "Use a while loop only"], correct: 1 },
      { q: "What does completing this module unlock?", options: ["Nothing", "Your Python certificate", "A new language automatically", "Admin access"], correct: 1 },
      { q: "What is the benefit of breaking a big problem into functions?", options: ["Makes code harder to read", "Makes code reusable and easier to debug", "Slows the program down", "Has no benefit"], correct: 1 },
    ],
  },
];

// 25-question final certification exam — gates the Python (Beginner) certificate.
// Stored as its own module ("final-exam") with a single level ("certification-quiz"),
// mirroring the structure used by the Intermediate track.
const FINAL_EXAM_QUESTIONS = [
  { q: "Which function displays text in Python?", options: ["show()", "print()", "echo()", "display()"], correct: 1 },
  { q: "What type is the value \"Hello\"?", options: ["Integer", "Boolean", "String", "Float"], correct: 2 },
  { q: "What does 7 // 2 return?", options: ["3.5", "3", "4", "2"], correct: 1 },
  { q: "What does 2 ** 3 return?", options: ["6", "8", "9", "5"], correct: 1 },
  { q: "What does \"hi\".upper() return?", options: ["hi", "HI", "Hi", "Error"], correct: 1 },
  { q: "What does len(\"hello\") return?", options: ["4", "5", "6", "Error"], correct: 1 },
  { q: "What type does input() always return?", options: ["int", "float", "str", "depends on input"], correct: 2 },
  { q: "What does int(\"7\") + 3 return?", options: ["\"73\"", "10", "Error", "7.3"], correct: 1 },
  { q: "Which keyword checks an additional condition after if?", options: ["else if", "elif", "elseif", "elsif"], correct: 1 },
  { q: "What does == check?", options: ["Assignment", "Equality", "Type only", "Identity"], correct: 1 },
  { q: "What does range(3) generate?", options: ["1,2,3", "0,1,2", "0,1,2,3", "1,2"], correct: 1 },
  { q: "What does break do inside a loop?", options: ["Skips one iteration", "Exits the loop entirely", "Restarts the loop", "Pauses execution"], correct: 1 },
  { q: "What causes an infinite loop?", options: ["A condition that's always False", "A condition that's always True", "Using range()", "Using break"], correct: 1 },
  { q: "What's the shorthand for count = count + 1?", options: ["count ++", "count += 1", "count =+ 1", "++count"], correct: 1 },
  { q: "What index is the first item in a list?", options: ["1", "0", "-1", "It depends"], correct: 1 },
  { q: "Can you change a tuple after creating it?", options: ["Yes, always", "No, tuples are immutable", "Only the first item", "Only with .set()"], correct: 1 },
  { q: "How do dictionaries store data?", options: ["By index", "As key-value pairs", "As sorted lists", "As tuples only"], correct: 1 },
  { q: "Do sets allow duplicate values?", options: ["Yes", "No", "Only numbers", "Only strings"], correct: 1 },
  { q: "Which keyword defines a function?", options: ["func", "def", "function", "define"], correct: 1 },
  { q: "What does return do?", options: ["Prints a value", "Sends a value back to the caller", "Ends the program", "Loops the function"], correct: 1 },
  { q: "What must every recursive function have to avoid infinite recursion?", options: ["A loop", "A base case", "A return type", "A global variable"], correct: 1 },
  { q: "Which prefix creates an f-string?", options: ["s\"\"", "f\"\"", "%s", "fmt\"\""], correct: 1 },
  { q: "Which block runs if an error occurs?", options: ["try", "except", "finally only", "catch"], correct: 1 },
  { q: "Why use 'with' when opening files?", options: ["It's required syntax", "It auto-closes the file safely", "It makes files load faster", "It prevents typos"], correct: 1 },
  { q: "Which keyword brings a module into your code?", options: ["include", "import", "require", "using"], correct: 1 },
];

async function main() {
  // Ensure the python language exists (create if this is the first run).
  let python = await prisma.language.findUnique({ where: { slug: "python" } });
  if (!python) {
    python = await prisma.language.create({
      data: {
        slug: "python",
        name: "Python",
        description: "Learn Python from your first print statement through building a small capstone program.",
        icon: "🐍",
        difficulty: "Beginner",
        order: 1,
      },
    });
    console.log("Created language: python");
  }

  for (let i = 0; i < PYTHON_MODULES.length; i++) {
    const m = PYTHON_MODULES[i];

    const mod = await prisma.module.upsert({
      where: { languageId_slug: { languageId: python.id, slug: m.slug } },
      update: { title: m.title, order: i + 1 },
      create: { languageId: python.id, slug: m.slug, title: m.title, order: i + 1 },
    });

    const level = await prisma.level.upsert({
      where: { moduleId_slug: { moduleId: mod.id, slug: "level-1" } },
      update: {
        title: m.title,
        theory: m.theory,
        examples: m.examples,
        practice: m.practice,
        xpReward: 50,
      },
      create: {
        moduleId: mod.id,
        slug: "level-1",
        title: m.title,
        order: 1,
        theory: m.theory,
        examples: m.examples,
        practice: m.practice,
        xpReward: 50,
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
    where: { languageId_slug: { languageId: python.id, slug: "final-exam" } },
    update: { title: "Certification Exam", order: PYTHON_MODULES.length + 1 },
    create: {
      languageId: python.id,
      slug: "final-exam",
      title: "Certification Exam",
      order: PYTHON_MODULES.length + 1,
    },
  });

  const examLevel = await prisma.level.upsert({
    where: { moduleId_slug: { moduleId: examModule.id, slug: "certification-quiz" } },
    update: {
      title: "Python — Certification Exam",
      theory: "A 25-question exam covering every topic from this track. Score 80% or higher (20/25) to earn your Python certificate.",
      examples: [],
      practice: [],
      xpReward: 200,
    },
    create: {
      moduleId: examModule.id,
      slug: "certification-quiz",
      title: "Python — Certification Exam",
      order: 1,
      theory: "A 25-question exam covering every topic from this track. Score 80% or higher (20/25) to earn your Python certificate.",
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
  console.log(`\nDone — seeded all ${PYTHON_MODULES.length} modules + final exam for python.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());