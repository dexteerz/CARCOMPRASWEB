// CONFIGURAÇÕES DE CONEXÃO FIREBASE
const config = {
	apiKey: "AIzaSyBoTRlfosL2xrcFlkDTy8sU0WJIfxqUOX4",
	authDomain: "projeto-2-8a6b3.firebaseapp.com",
	databaseURL: "https://projeto-2-8a6b3.firebaseio.com",
	projectId: "projeto-2-8a6b3",
	storageBucket: "projeto-2-8a6b3.appspot.com",
	messagingSenderId: "503783157743",
	appId: "1:503783157743:web:3d3e64e8eb9dd9f2"
};
// INICIALIZANDO FIREBASE
firebase.initializeApp(config);


// FIREBASE DATABASE REFERENCE E "TABELA" 
const dbRef = firebase.database().ref();
const productsRef = dbRef.child('products');

readproductData();


// --------------------------
// LISTAR PRODUTO
// --------------------------
function readproductData() {

	const productListUI = document.getElementById("product-list");

	productsRef.on("value", snap => {

		productListUI.innerHTML = ""

		snap.forEach(childSnap => {

			let key = childSnap.key,
				value = childSnap.val()

			let $li = document.createElement("li");

			// ICONE DE EDITAR
			let editIconUI = document.createElement("span");
			editIconUI.class = "edit-product";
			editIconUI.innerHTML = "  📝";
			editIconUI.setAttribute("productid", key);
			editIconUI.addEventListener("click", editButtonClicked)

			// ICONE DE DELETAR
			let deleteIconUI = document.createElement("span");
			deleteIconUI.class = "delete-product";
			deleteIconUI.innerHTML = "  ❌";
			deleteIconUI.setAttribute("productid", key);
			deleteIconUI.addEventListener("click", deleteButtonClicked)

			$li.innerHTML = key;
			$li.append(editIconUI);
			$li.append(deleteIconUI);

			$li.setAttribute("product-key", key);
			$li.addEventListener("click", productClicked)
			productListUI.append($li);

		});


	})

}


// --------------------------
// AO SELECIONAR UM ITEM LISTADO
// --------------------------
function productClicked(e) {

	var productID = e.target.getAttribute("product-key");

	const productRef = dbRef.child('products/' + productID);
	const productDetailUI = document.getElementById("product-detail");

	productRef.on("value", snap => {

		productDetailUI.innerHTML = ""

		snap.forEach(childSnap => {
			var $p = document.createElement("p");
			$p.innerHTML = childSnap.key + " - " + childSnap.val();
			productDetailUI.append($p);
		})

	});


}



// --------------------------
// ADICIONAR NOVO PRODUTO
// --------------------------
const addproductBtnUI = document.getElementById("add-product-btn");
addproductBtnUI.addEventListener("click", addproductBtnClicked)

function addproductBtnClicked() {

	const productsRef = dbRef.child('products');
	const addproductInputsUI = document.getElementsByClassName("product-input");

	// ESTE OBJETO IRÁ GUARDAR AS INFORMAÇÕES PARA O NOVO PRODUTO
	let newproduct = {};
	var x = document.getElementById("codBar").value;

	// LOOP QUE RECEBERÁ AS INFORMAÇÕES DO MODAL
	for (let i = 0, len = addproductInputsUI.length; i < len; i++) {
		let key = addproductInputsUI[i].getAttribute('data-key');
		let value = addproductInputsUI[i].value;
		if (i == 2) {
			value = parseFloat(addproductInputsUI[i].value);
		}
		newproduct[key] = value;
	}

	// SALVA NO FIREBASE
	productsRef.child(x).set(newproduct);
}


// --------------------------
// DELETAR PRODUTO
// --------------------------
function deleteButtonClicked(e) {
	e.stopPropagation();
	var productID = e.target.getAttribute("productid");
	const productRef = dbRef.child('products/' + productID);
	// DELETA NO FIREBASE
	productRef.remove();

}


// --------------------------
// EDITAR PRODUTO
// --------------------------
function editButtonClicked(e) {
	document.getElementById('modalEditar').style.display = "block";

	// DEFINE O CÓDIGO DE BARRA QUE IRÁ SER EDITADO NO CAMPO HIDDEN NO HTML
	document.querySelector(".edit-productid").value = e.target.getAttribute("productid");

	const productRef = dbRef.child('products/' + e.target.getAttribute("productid"));

	// set data to the product field
	const editproductInputsUI = document.querySelectorAll(".edit-product-input");


	productRef.on("value", snap => {

		for (var i = 0, len = editproductInputsUI.length; i < len; i++) {

			var key = editproductInputsUI[i].getAttribute("data-key");

			editproductInputsUI[i].value = snap.val()[key];

		}

	});

	const saveBtn = document.querySelector("#edit-product-btn");
	saveBtn.addEventListener("click", saveproductBtnClicked)
}


function saveproductBtnClicked(e) {

	const productID = document.querySelector(".edit-productid").value;
	const productRef = dbRef.child('products/' + productID);

	var editedproductObject = {}

	const editproductInputsUI = document.querySelectorAll(".edit-product-input");


	editproductInputsUI.forEach(function (textField, index) {
		let key = textField.getAttribute("data-key");
		if (textField.getAttribute("data-key") == "priceProd") {
			let value = textField.value;
		} else {
			let value = parseFloat(textField.value);
		}
		editedproductObject[textField.getAttribute("data-key")] = textField.value;


	});

	editedproductObject['priceProd'] = parseFloat(editedproductObject['priceProd']);

	productRef.update(editedproductObject);

	document.getElementById('edit-product-module').style.display = "none";


}