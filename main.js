const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

//Masukin Buku Ke dalam List
function makeBookToList(bookObject) {
  const judulBuku = document.createElement("h3");
  judulBuku.classList.add("book-title");
  judulBuku.innerText = bookObject.title;

  const pengarangBuku = document.createElement("p");
  pengarangBuku.innerText = "Penulis: " + bookObject.author;

  const tahunBuku = document.createElement("p");
  tahunBuku.innerText = "Tahun: " + bookObject.year;

  const artikelBuku = document.createElement("article");
  artikelBuku.classList.add("book_item");
  artikelBuku.append(judulBuku, pengarangBuku, tahunBuku);
  artikelBuku.setAttribute("id", `${bookObject.id}`);

  const greenButton = document.createElement("button");
  greenButton.classList.add("green");

  if (bookObject.isCompleted) {
    greenButton.innerText = "Belum Selesai Dibaca";
    greenButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });
  } else {
    greenButton.innerText = "Selesai Dibaca";
    greenButton.addEventListener("click", function () {
      addBookToCompleteBook(bookObject.id);
    });
  }

  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function () {
    if (confirm("Apakah anda yakin ingin menghapus buku ini?")) {
      removeBookFromList(bookObject.id);
    } else {
      return;
    }
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");
  buttonContainer.append(greenButton, redButton);

  artikelBuku.append(buttonContainer);
  return artikelBuku;
}
//function untuk undo buku
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//function untuk buku selesai dibaca
function addBookToCompleteBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function untuk menghapus buku
function removeBookFromList(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

// struktur buku
function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    isCompleted
  );

  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
//Generate ID
function generateId() {
  return +new Date();
}

// Generate ObjectBook
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBookList.innerText = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerText = "";

  for (const bookItem of books) {
    const bookElement = makeBookToList(bookItem);
    if (bookItem.isCompleted == false) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  const spanSubmitForm = document.querySelector("#inputBook span");
  const completeCheckbox = document.getElementById("inputBookIsComplete");
  const searchBook = document.getElementById("searchSubmit");

  searchBook.addEventListener("click", function (e) {
    e.preventDefault();
  });

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  completeCheckbox.addEventListener("change", function () {
    spanSubmitForm.innerText = "";
    if (this.checked) {
      spanSubmitForm.innerText = "Selesai dibaca";
    } else {
      spanSubmitForm.innerText = "Belum selesai dibaca";
    }
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data != null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

const btnSearch = document.getElementById("searchSubmit");
btnSearch.addEventListener("click", function (e) {
  const searchBookTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const titleBook = document.querySelectorAll("article");

  for (const book of titleBook) {
    const title = book.children[0].innerText.toLowerCase();
    console.log(title);
    console.log(searchBookTitle);
    if (title.includes(searchBookTitle)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  }
});
