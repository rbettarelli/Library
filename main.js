const newBookbtn = document.querySelector(".addBookImg");
const closeForm = document.getElementsByTagName("span")[0];
const form = document.getElementById("addBook");
const title = document.getElementById("bookTitle");
const author = document.getElementById("bookAuthor");
const pages = document.getElementById("bookPages");
const read = document.getElementById("readCheckbox");
const bookAdd = document.querySelector("#bookAdd");
const bookSelection = document.querySelector(".booksGrid");
const totalBooks = document.getElementById("totalBooks");

newBookbtn.addEventListener("click", () => {
  document.querySelector(".newBookContainer").style.display = "block";
});

closeForm.addEventListener("click", () => {
  document.querySelector(".newBookContainer").style.display = "none";
  form.reset();
});



class Book {
  constructor(
    title = "Unknown",
    author = "Unknown",
    pages = "0",
    read = "false"
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

const myLibrary = JSON.parse(localStorage.getItem("storage")) || [];

const updateLocalStorage = () => {
  localStorage.setItem("storage", JSON.stringify(myLibrary));
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newBook = new Book(
    title.value,
    author.value,
    pages.value,
    read.checked
  );
  myLibrary.push(newBook);
  updateLocalStorage();
  form.reset();
  showBooks();
});

const showBooks = () => {
  bookSelection.textContent = "";
  myLibrary.forEach((newBook, index) => {
    createBookCard(newBook, index);
  });

  removeBooks();
  updateBookRead();
  updateLocalStorage();
  updateStatusBook();
};

const removeBooks = () => {
  const removeBtn = document.querySelectorAll(".card-btn");
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      myLibrary.splice(btn.getAttribute("data"), 1);
      updateBookRead();
      showBooks();
    });
  });
};

const updateBookRead = () => {
  const bookCheckbox = document.querySelectorAll(".card-checkbox");
  bookCheckbox.forEach((checkbox) => {
    checkbox.addEventListener("click", (update) => {
      const bookIndex = checkbox.getAttribute("data");
      const readValue = checkbox.checked;
      update = Object.create(Book.prototype);
      update.updateBook(bookIndex, readValue);
      updateLocalStorage();
      updateStatusBook();
    });
  });
};

const updateStatusBook = () => {
  const booksComplete = document.getElementById("booksComplete");
  const booksUnread = document.getElementById("booksUnread");
  const totalBooks = document.getElementById("totalBooks");

  let completeCount = 0;
  let incompleteCount = 0;
  booksUnread.textContent = 0;
  booksComplete.textContent = 0;

  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].read === true) {
      completeCount++;
      booksComplete.textContent = completeCount;
    } else {
      incompleteCount++;
      booksUnread.textContent = incompleteCount;
    }
  }
  totalBooks.textContent = myLibrary.length;
}

Book.prototype.updateBook = function (index, value) {
  myLibrary[index].read = value;
};
const createBookCard = (book, index) => {
  const newCardDiv = document.createElement("div");
  newCardDiv.classList.add("bookCard");

  const cardTitle = document.createElement("h2");
  cardTitle.classList.add("cardTitle");
  cardTitle.innerText = book.title;
  newCardDiv.append(cardTitle);

  const cardAuthor = document.createElement("p");
  cardAuthor.classList.add("cardAuthor");
  cardAuthor.innerText = book.author;
  newCardDiv.append(cardAuthor);

  const cardPages = document.createElement("p");
  cardPages.classList.add("cardPages");
  cardPages.textContent = `Pages: ${book.pages}`;
  newCardDiv.append(cardPages);

  const cardCheckboxLabel = document.createElement("label");
  cardCheckboxLabel.classList.add("card-checkbox-label");
  cardCheckboxLabel.setAttribute("for", `checkboxLabel${index}`);
  book.read === true
    ? (cardCheckboxLabel.textContent = "Read")
    : (cardCheckboxLabel.textContent = "Unread");

  const cardCheckbox = document.createElement("input");
  cardCheckbox.setAttribute("data", index);
  cardCheckbox.setAttribute("type", "checkbox");
  cardCheckbox.setAttribute("id", `checkbox${index}`);
  cardCheckbox.setAttribute("name", `checkbox${index}`);
  cardCheckbox.classList.add("card-checkbox");
  cardCheckbox.checked = book.read;
  cardCheckbox.addEventListener("click", () => {
    book.read === false
      ? (cardCheckboxLabel.textContent = "Read")
      : (cardCheckboxLabel.textContent = "Unread");
  });

  const readContainer = document.createElement("div");
  readContainer.classList.add("readContainer");

  readContainer.append(cardCheckboxLabel);
  readContainer.append(cardCheckbox);
  newCardDiv.append(readContainer);

  const cardBtn = document.createElement("button");
  cardBtn.setAttribute("data", index);
  cardBtn.innerText = "Delete this book";
  cardBtn.classList.add("card-btn");

  newCardDiv.append(cardBtn);

  bookSelection.append(newCardDiv);
}

showBooks();
