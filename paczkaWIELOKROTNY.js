const questions = [
    {
        q: "Które z poniższych typów w C# należą do kategorii typów wartościowych (Value Types)?",
        o: ["class", "struct", "enum", "interface", "int"],
        c: [1, 2, 4],
        type: "multiple",
        h: "Wykład 2: Typy wartościowe to m.in. struktury (struct), typy wyliczeniowe (enum) oraz typy proste jak int, bool, double. Klasy i interfejsy to typy referencyjne."
    },
    {
        q: "Które właściwości i metody są dostępne bezpośrednio dla obiektów klasy System.Array?",
        o: ["Length", "Rank", "Count", "Capacity", "GetLength()"],
        c: [0, 1, 4],
        type: "multiple",
        h: "Wykład 5: Tablice posiadają właściwości Length (całkowita liczba elementów) i Rank (liczba wymiarów) oraz metodę GetLength(). Count i Capacity są charakterystyczne dla List<T>."
    },
    {
        q: "Wskaż modyfikatory dostępu, które pozwalają na dostęp do składowej klasy z poziomu klasy pochodnej (dziedziczącej):",
        o: ["private", "protected", "public", "internal (w tym samym projekcie)"],
        c: [1, 2, 3],
        type: "multiple",
        h: "Wykład 11: Modyfikator protected jest stworzony specjalnie dla dziedziczenia. Public i internal również pozwalają na dostęp (internal pod warunkiem pracy w tym samym zestawie/assembly)."
    },
    {
        q: "Które ze stwierdzeń dotyczących klasy statycznej (static class) są PRAWDZIWE?",
        o: ["Można utworzyć jej obiekt za pomocą 'new'", "Wszystkie jej składowe muszą być statyczne", "Nie może być dziedziczona (jest niejawnie sealed)", "Może zawierać niestatyczny konstruktor"],
        c: [1, 2],
        type: "multiple",
        h: "Wykład 11: Klasy statycznej nie można instancjonować (new), wszystkie jej pola i metody muszą mieć modyfikator static i nie może ona służyć jako baza do dziedziczenia."
    },
    {
        q: "Które z poniższych kolekcji pochodzą z przestrzeni nazw System.Collections.Generic?",
        o: ["ArrayList", "List<T>", "Hashtable", "Dictionary<TKey, TValue>", "Stack<T>"],
        c: [1, 3, 4],
        type: "multiple",
        h: "Wykład 9: Kolekcje generyczne (wprowadzone w .NET 2.0) to m.in. List, Dictionary, Queue i Stack. ArrayList i Hashtable to stare kolekcje niegeneryczne z System.Collections."
    }
];