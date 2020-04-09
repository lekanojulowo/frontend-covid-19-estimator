'use strict';
const $q = document.querySelector.bind(document);
const $qa = document.querySelectorAll.bind(document);

 /* Modal */ 
const openModal = $qa('.open-modal-button'); // all open modal btn trigger 

openModal.forEach(btn => {
  btn.addEventListener('click', ev => {
    const id = ev.target.dataset.target; // modal id 
    const modal = $q(`#${id}`); // select the modal with the given id
    /*TODO: add a data- attribute to the modal to know whether to add or to edit */
    const closeModal = modal.querySelectorAll('.close-modal-button'); // all close modal btn
    const sendBtn = modal.querySelector('.send-bug-report'); // send btn
    const notification = modal.querySelector('.modal-success-notification'); // send btn
    const closeNotification = modal.querySelector('.close-notification'); // close notification btn
    const modalMsg = modal.querySelector('.modal-msg'); // modal textarea

    modal.classList.add('is-active'); // activate the modal
    sendBtn.onclick = () => {
      modalMsg.value = '';
      notification.classList.remove('is-hidden');
      const notificationTimeout = setTimeout(() => notification.classList.add('is-hidden'), 4000);
      // closeNotification.onclick = () => notification.classList.add('is-hidden');
      closeNotification.onclick = () => {
        closeNotification.closest('.notification').classList.add('is-hidden');
        clearTimeout(notificationTimeout);
      }
    }
    closeModal.forEach(el => el.onclick = () => modal.classList.remove('is-active')); // close the modal with any close btn

  })
});

/*  Handle Navbar-burger and navbar-menu */
const burger = $q('.navbar-burger');
const menu = $q('.navbar-menu')

// toggle the navbar-menu and the navbar-burger
if (burger) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });
}

 /* Handle Dropdowns */
const dropdowns = document.querySelectorAll('.dropdown:not(.is-hoverable)'); // clickable dropdowns
if (dropdowns.length > 0) {
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', event => {
      event.preventDefault();
      dropdown.classList.toggle('is-active');
    });
  });

  document.addEventListener('click', event => {
    if (!event.defaultPrevented) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('is-active');
      });
    }
  });
}


/* Delete an item of column */
// for delete an item
const deleteItem = document.querySelectorAll('.delete-item');
if (deleteItem.length > 0) {
  deleteItem.forEach(button => {
    button.addEventListener('click', function () {
      button.closest('.column').remove();
    });
  })
}
/* Delete an item of tr (row) */
//for deleting a customer
const deleteUserButton = document.querySelectorAll('.delete-user');
if (deleteUserButton.length > 0) {
  deleteUserButton.forEach(button => {
    button.addEventListener('click', function () {
      button.closest('tr').remove();

    });
  });
}

