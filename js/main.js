var saveBtn = document.getElementById("saveBtn");
var updateBtn = document.getElementById("updateBtnForm");
var cancleBtn = document.getElementById("cancleBtn");
var openBtn = document.getElementById("openForm");
var avatarBtn = document.getElementById("avatar");
var xClose = document.querySelector(".btn-close");

var imageInput = document.getElementById("imageInput");
var avatarPreview = document.getElementById("avatarPreview");
var searchInput = document.getElementById("search");

var fName = document.getElementById("fName");
var phone = document.getElementById("phone");
var email = document.getElementById("email");
var address = document.getElementById("address");
var group = document.getElementById("group");
var notes = document.getElementById("note");
var favorite = document.getElementById("favorite");
var emergency = document.getElementById("emergency");

var totalCount = document.getElementById("totalCount");
var favoriteCount = document.getElementById("favoriteCount");
var emergencyCount = document.getElementById("emergencyCount");

var selectedImage = "";
var contacts = [];
var currentIndex;

if (localStorage.getItem("all") != null) {
  contacts = JSON.parse(localStorage.getItem("all"));
  displayContact();
  displayFavorites();
  displayEmergency();
}

saveBtn.addEventListener("click", addContact);
cancleBtn.addEventListener("click", closeModal);
updateBtn.addEventListener("click", updateContact);
openBtn.addEventListener("click", showForm);
xClose.addEventListener("click", closeModal);

fName.addEventListener("input", varificationName);
phone.addEventListener("input", varificationPhone);
email.addEventListener("input", varificationEmail);

avatarBtn.addEventListener("click", function () {
  imageInput.click();
});
searchInput.addEventListener("input", function () {
  searchContact(this.value);
});
imageInput.addEventListener("change", function () {
  var file = imageInput.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    selectedImage = e.target.result;
    avatarPreview.innerHTML = `
      <img src="${selectedImage}" 
           class="w-100 h-100 rounded-circle object-fit-cover" />
    `;
  };
  reader.readAsDataURL(file);
});

//Contacts
function getAvatar(contact) {
  if (contact.image) {
    return `
      <img src="${contact.image}"
           class="w-100 h-100 rounded-3 object-fit-cover" />
    `;
  } else {
    return contact.fName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }
}
function addContact() {
  if (varificationName() && varificationPhone() && varificationEmail()) {
    var contact = {
      fName: fName.value,
      phone: phone.value,
      email: email.value,
      address: address.value,
      group: group.value,
      notes: notes.value,
      favorite: favorite.checked,
      emergency: emergency.checked,
      image: selectedImage,
    };

    contacts.push(contact);
    localStorage.setItem("all", JSON.stringify(contacts));
    displayContact();
    displayFavorites();
    displayEmergency();
    clearContact();
    closeModal();

    showSuccessDialog(
      "Saved Successfully",
      "Contact has been added successfully"
    );
  }
}
function displayContact() {
  var cartona = "";
  for (var i = 0; i < contacts.length; i++) {
    cartona += `
      <div class="col-lg-6">
        <div class="card contact-card p-4 rounded-4 h-100">

          <div class="d-flex gap-3 mb-3">
            <div class="avatar text-light d-flex justify-content-center align-items-center fw-bold fs-4 rounded-3">
              ${getAvatar(contacts[i])}
            </div>

            <div>
              <h6 class="fw-bold mb-1">${contacts[i].fName}</h6>
              <p class="text-secondary mb-1 small d-flex align-items-center">
                <i class="fa-solid fa-phone me-2"></i>
                ${contacts[i].phone}
              </p>
            </div>
          </div>

          <div class="d-flex flex-column gap-2 mb-3">
            ${
              contacts[i].email
                ? `
              <p class="text-secondary small mb-0">
                <i class="fa-solid fa-envelope me-2"></i>
                ${contacts[i].email}
              </p>`
                : ""
            }

            ${
              contacts[i].address
                ? `
              <p class="text-secondary small mb-0">
                <i class="fa-solid fa-location-dot me-2"></i>
                ${contacts[i].address}
              </p>`
                : ""
            }
          </div>

          ${
            contacts[i].group !== "Select a group"
              ? `
            <span class="badge bg-primary-subtle text-primary mb-3">
              ${contacts[i].group}
            </span>`
              : ""
          }

          <div class="d-flex justify-content-between align-items-center pt-3 border-top">
            <div class="d-flex gap-2">
              <button class="btn btn-success-subtle rounded-3">
                <i class="fa-solid fa-phone btn-success-subtle"></i>
              </button>
              <button class="btn btn-primary-subtle rounded-3">
                <i class="fa-solid fa-envelope"></i>
              </button>
            </div>

            <div class="d-flex gap-2 text-secondary">
             <i class="fa-regular fa-star
   ${contacts[i].favorite ? "text-warning" : ""}"
   onclick="toggleFavorite(${i})"></i>

<i class="fa-regular fa-heart
   ${contacts[i].emergency ? "text-danger" : ""}"
   onclick="toggleEmergency(${i})"></i>

              <i class="fa-regular fa-pen-to-square"
                 onclick="preUpdateContact(${i})"></i>
              <i class="fa-regular fa-trash-can"
                 onclick="openDeleteDialog(${i})"></i>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  document.getElementById("card").innerHTML = cartona;
  updateCounters();
}
function clearContact() {
  fName.value = "";
  phone.value = "";
  email.value = "";
  address.value = "";
  notes.value = "";
  group.selectedIndex = 0;
  favorite.checked = false;
  emergency.checked = false;
  selectedImage = "";
  imageInput.value = "";
  avatarPreview.innerHTML = `
    <i class="fa-solid fa-user text-white fs-1"></i>
  `;
  fName.classList.remove("is-valid", "is-invalid");
  phone.classList.remove("is-valid", "is-invalid");
  email.classList.remove("is-valid", "is-invalid");
}
function deleteContact(index) {
  contacts.splice(index, 1);
  localStorage.setItem("all", JSON.stringify(contacts));
  displayContact();
}
function preUpdateContact(index) {
  currentIndex = index;
  document.getElementById("addContactModal").classList.remove("d-none");
  document.body.style.overflow = "hidden";
  fName.value = contacts[index].fName;
  phone.value = contacts[index].phone;
  email.value = contacts[index].email;
  address.value = contacts[index].address;
  group.value = contacts[index].group;
  notes.value = contacts[index].notes;
  favorite.checked = contacts[index].favorite;
  emergency.checked = contacts[index].emergency;
  selectedImage = contacts[index].image || "";
  if (selectedImage) {
    avatarPreview.innerHTML = `
      <img src="${selectedImage}"
           class="w-100 h-100 rounded-circle object-fit-cover" />
    `;
  }
  saveBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

function updateContact() {
  if (varificationName() && varificationPhone() && varificationEmail()) {
    var contact = {
      fName: fName.value,
      phone: phone.value,
      email: email.value,
      address: address.value,
      group: group.value,
      notes: notes.value,
      favorite: favorite.checked,
      emergency: emergency.checked,
      image: selectedImage,
    };

    contacts.splice(currentIndex, 1, contact);
    localStorage.setItem("all", JSON.stringify(contacts));
    displayContact();
    displayFavorites();
    displayEmergency();
    clearContact();
    updateBtn.classList.add("d-none");
    saveBtn.classList.remove("d-none");
    closeModal();
  }
}
function searchContact(term) {
  term = term.trim().toLowerCase();
  if (term === "") {
    displayContact();
    return;
  }
  var cartona = "";
  for (var i = 0; i < contacts.length; i++) {
    if (
      contacts[i].fName.toLowerCase().includes(term) ||
      contacts[i].phone.includes(term) ||
      (contacts[i].email && contacts[i].email.toLowerCase().includes(term))
    ) {
      cartona += `
        <div class="col-lg-6">
        <div class="card contact-card p-4 rounded-4 h-100">
          <div class="d-flex gap-3 mb-3">
            <div class="avatar text-light d-flex justify-content-center align-items-center fw-bold fs-4 rounded-3">
              ${getAvatar(contacts[i])}
            </div>
            <div>
              <h6 class="fw-bold mb-1">${contacts[i].fName}</h6>
              <p class="text-secondary mb-1 small d-flex align-items-center rounded-2">
                <i class="fa-solid fa-phone me-2 d-flex align-items-center"></i>
                ${contacts[i].phone}
              </p>
            </div>
          </div>
          <div class="d-flex flex-column gap-2 mb-3 d-flex justify-content-center align-items-center rounded-2">
            ${
              contacts[i].email
                ? `
              <p class="text-secondary small mb-0 rounded-2 d-flex justify-content-center align-items-center ">
                <i class="fa-solid fa-envelope me-2 d-flex justify-content-center align-items-center"></i>
                ${contacts[i].email}
              </p>`
                : ""
            }

            ${
              contacts[i].address
                ? `
              <p class="text-secondary small mb-0">
                <i class="fa-solid fa-location-dot me-2"></i>
                ${contacts[i].address}
              </p>`
                : ""
            }
          </div>
          ${
            contacts[i].group !== "Select a group"
              ? `
            <span class="badge bg-primary-subtle text-primary mb-3">
              ${contacts[i].group}
            </span>`
              : ""
          }

          <div class="d-flex justify-content-between align-items-center pt-3 border-top">
            <div class="d-flex gap-2 btn-success-subtle">
              <button class="btn btn-success-subtle rounded-3">
                <i class="fa-solid fa-phone btn-success-subtle"></i>
              </button>
              <button class="btn btn-primary-subtle rounded-3">
                <i class="fa-solid fa-envelope"></i>
              </button>
            </div>
            <div class="d-flex gap-2 text-secondary">
            <i class="fa-regular fa-star
   ${contacts[i].favorite ? "text-warning" : ""}"
   onclick="toggleFavorite(${i})"></i>

<i class="fa-regular fa-heart
   ${contacts[i].emergency ? "text-danger" : ""}"
   onclick="toggleEmergency(${i})"></i>

              <i class="fa-regular fa-pen-to-square"
                 onclick="preUpdateContact(${i})"></i>
              <i class="fa-regular fa-trash-can"
                 onclick="openDeleteDialog(${i})"></i>
            </div>
          </div>

        </div>
      </div>
      `;
    }
  }

  document.getElementById("card").innerHTML = cartona;
}

//Form
function showForm() {
  document.getElementById("addContactModal").classList.remove("d-none");
  document.body.style.overflow = "hidden";
  clearContact();
  saveBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
}
function closeModal() {
  document.getElementById("addContactModal").classList.add("d-none");
  document.body.style.overflow = "auto";
}

//Varification Functions
function varificationName() {
  var nameRegex = /^[a-zA-Z\s]{3,}$/;

  if (nameRegex.test(fName.value)) {
    fName.classList.remove("is-invalid");
    fName.classList.add("is-valid");
    document.getElementById("alertName").classList.replace("d-block", "d-none");
    return true;
  } else {
    fName.classList.remove("is-valid");
    fName.classList.add("is-invalid");
    document.getElementById("alertName").classList.replace("d-none", "d-block");
    return false;
  }
}
function varificationPhone() {
  var phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;

  if (phoneRegex.test(phone.value)) {
    phone.classList.remove("is-invalid");
    phone.classList.add("is-valid");
    document
      .getElementById("alertPhone")
      .classList.replace("d-block", "d-none");
    return true;
  } else {
    phone.classList.remove("is-valid");
    phone.classList.add("is-invalid");
    document
      .getElementById("alertPhone")
      .classList.replace("d-none", "d-block");
    return false;
  }
}
function varificationEmail() {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(email.value)) {
    email.classList.remove("is-invalid");
    email.classList.add("is-valid");
    document
      .getElementById("alertEmail")
      .classList.replace("d-block", "d-none");
    return true;
  } else {
    email.classList.remove("is-valid");
    email.classList.add("is-invalid");
    document
      .getElementById("alertEmail")
      .classList.replace("d-none", "d-block");
    return false;
  }
}

//Counters Functions
function updateCounters() {
  totalCount.innerText = contacts.length;
  var fav = 0;
  var emg = 0;
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].favorite) {
      fav++;
    }
    if (contacts[i].emergency) {
      emg++;
    }
  }
  favoriteCount.innerText = fav;
  emergencyCount.innerText = emg;
}
function toggleFavorite(index) {
  contacts[index].favorite = !contacts[index].favorite;
  localStorage.setItem("all", JSON.stringify(contacts));

  displayContact();
  displayFavorites();
}
function toggleEmergency(index) {
  contacts[index].emergency = !contacts[index].emergency;
  localStorage.setItem("all", JSON.stringify(contacts));

  displayContact();
  displayEmergency();
}
function displayFavorites() {
  var cartona = "";
  var favContacts = contacts.filter((c) => c.favorite);
  if (favContacts.length === 0) {
    cartona = `<p class="text-secondary small text-center">No favorites yet</p>`;
  } else {
    for (var i = 0; i < favContacts.length; i++) {
      cartona += `
        <div class="d-flex align-items-center justify-content-between p-3 mb-2 bg-bg-secondary-subtle rounded-4 shadow-sm mx-4">
          <div class="d-flex align-items-center gap-3 ">
           <div class="avatar text-light d-flex justify-content-center align-items-center fw-bold fs-4 rounded-3 bg-primary px-3 py-2">
              ${getAvatar(contacts[i])}
            </div>
            <div>
              <h6 class="mb-0 fw-bold">${favContacts[i].fName}</h6>
              <small class="text-secondary">${favContacts[i].phone}</small>
            </div>
          </div>
            <div
                  class="bg-success-subtle p-2 rounded-2 d-flex align-items-center justify-content-center"
                >
                  <i class="fa-solid fa-phone text-success"></i>
                </div>
        </div>
      `;
    }
  }

  document.getElementById("fvCard").innerHTML = cartona;
}
function displayEmergency() {
  var cartona = "";
  var emgContacts = contacts.filter((c) => c.emergency);

  if (emgContacts.length === 0) {
    cartona = `<p class="text-secondary small text-center">No emergency contacts</p>`;
  } else {
    for (var i = 0; i < emgContacts.length; i++) {
      cartona += `
             <div class="d-flex align-items-center justify-content-between p-3 mb-2 bg-bg-secondary-subtle rounded-4 shadow-sm mx-4">
          <div class="d-flex align-items-center gap-3 ">
           <div class="avatar text-light d-flex justify-content-center align-items-center fw-bold fs-4 rounded-3 bg-primary px-3 py-2">
              ${getAvatar(contacts[i])}
            </div>
            <div>
              <h6 class="mb-0 fw-bold">${emgContacts[i].fName}</h6>
              <small class="text-secondary">${emgContacts[i].phone}</small>
            </div>
          </div>
            <div
                  class="bg-danger-subtle p-2 rounded-2 d-flex align-items-center justify-content-center"
                >
                  <i class="fa-solid fa-phone text-danger"></i>
                </div>
        </div>
      `;
    }
  }

  document.getElementById("emgCard").innerHTML = cartona;
}

//Dialoge
var deleteIndex;
function openDeleteDialog(index) {
  deleteIndex = index;

  document.getElementById("deleteModalBody").innerHTML = `
    <i class="fa-solid fa-circle-exclamation text-warning fs-1 mb-3"></i>
    <h4 class="fw-bold">Delete Contact?</h4>
    <p class="text-secondary">
      Are you sure you want to delete
      <strong>${contacts[index].fName}</strong>?
    </p>

    <div class="d-flex justify-content-center gap-3 mt-4">
      <button class="btn btn-danger px-4"
        onclick="confirmDelete()">Yes, delete it!</button>

      <button class="btn btn-outline-secondary px-4"
        onclick="closeDeleteModal()">Cancel</button>
    </div>
  `;

  document.getElementById("deleteModal").classList.remove("d-none");
}
function confirmDelete() {
  contacts.splice(deleteIndex, 1);
  localStorage.setItem("all", JSON.stringify(contacts));
  displayContact();
  updateCounters();

  document.getElementById("deleteModalBody").innerHTML = `
    <i class="fa-solid fa-circle-check text-success fs-1 mb-3"></i>
    <h5 class="fw-bold">Deleted Successfully</h5>
    <p class="text-secondary">Contact has been removed</p>
  `;

  setTimeout(closeDeleteModal, 1200);
}
function closeDeleteModal() {
  document.getElementById("deleteModal").classList.add("d-none");
  document.body.style.overflow = "auto";
}
function showSuccessDialog(title, message) {
  document.getElementById("deleteModalBody").innerHTML = `
    <i class="fa-solid fa-circle-check text-success fs-1 mb-3"></i>
    <h5 class="fw-bold">${title}</h5>
    <p class="text-secondary">${message}</p>
  `;

  document.getElementById("deleteModal").classList.remove("d-none");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    closeDeleteModal();
  }, 1200);
}
