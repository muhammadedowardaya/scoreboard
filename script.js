class User {
	static objArray = [];
	static objCount = 0;
	static objId = 0;

	constructor(nama, score = 0) {
		this.id = ++User.objId;
		this.nama = nama;
		this.score = score;

		User.objCount++;
		User.objArray.push(this);

		if (localStorage.getItem("Users") != null) {
			let users = localStorage.getItem("Users");
			let objUsers = JSON.parse(users);
			User.objArray = objUsers;
		} else {
			localStorage.setItem("Users", JSON.stringify(User.objArray));
		}
	}

	static updateNamaById(id, nama) {
		const objek = User.objArray.find((obj) => obj.id == id);
		if (objek) {
			objek.nama = nama;
			localStorage.setItem("Users", JSON.stringify(User.objArray));
			// alert("nama berhasil di ubah");
		} else {
			alert(`objek dengan id ${id} tidak ditemukan`);
		}
	}

	static updateScoreById(id, score) {
		const objek = User.objArray.find((obj) => obj.id == id);
		if (objek) {
			objek.score = score;
			localStorage.setItem("Users", JSON.stringify(User.objArray));
			// alert("score berhasil di ubah");
		} else {
			alert(`objek dengan id ${id} tidak ditemukan`);
		}
	}
}

const user1 = new User("user 1");
const user2 = new User("user 2");

class CardBoard extends HTMLElement {
	connectedCallback() {
		this.render();
	}

	set id(value) {
		this._id = value;
		this.render();
	}

	get id() {
		return this._id;
	}

	set nama(value = "") {
		this._nama = value;
		this.render();
	}

	get nama() {
		return this._nama;
	}

	set scoreValue(value = 0) {
		this._scoreValue = value;
		this.render();
	}

	get scoreValue() {
		return this._scoreValue;
	}

	set onChangeNameClick(event) {
		this._onChangeNameClick = event;
		this.render();
	}
	set onMinButtonClick(event) {
		this._onMinButtonClick = event;
		this.render();
	}
	set onPlusButtonClick(event) {
		this._onPlusButtonClick = event;
		this.render();
	}

	render() {
		this.innerHTML = `
        <div class="card-board">
            <div class="name">
                <h2>${this._nama}</h2>
                <button class="change-name" data-id="${this._id}">Change name...</button>
            </div>
            <div class="score">
                <div class="score-value">${this._scoreValue}</div>
            </div>
            <div class="action-button">
                <button id="min">-</button>
                <button id="plus">+</button>
            </div>
        </div>
        `;

		this.querySelector(".change-name").addEventListener(
			"click",
			this._onChangeNameClick
		);
		this.querySelector("#min").addEventListener(
			"click",
			this._onMinButtonClick
		);
		this.querySelector("#plus").addEventListener(
			"click",
			this._onPlusButtonClick
		);
	}
}

customElements.define("card-board", CardBoard);

for (let i = 0; i < User.objCount; i++) {
	const mainElement = document.querySelector("main");
	const cardBoardElement = document.createElement("card-board");

	if (User.objArray[i].nama) {
		cardBoardElement.id = User.objArray[i].id;
		cardBoardElement.nama = User.objArray[i].nama;
		cardBoardElement.scoreValue = User.objArray[i].score;

		cardBoardElement.onPlusButtonClick = () => {
			const id = cardBoardElement.id;
			let score;
			if (cardBoardElement.scoreValue >= 0) {
				score = cardBoardElement.scoreValue + 1;
			}
			User.updateScoreById(id, score);
			cardBoardElement.scoreValue = score;
		};

		cardBoardElement.onMinButtonClick = () => {
			const id = cardBoardElement.id;
			let score;
			if (cardBoardElement.scoreValue > 0) {
				score = cardBoardElement.scoreValue - 1;
			}
			User.updateScoreById(id, score);
			cardBoardElement.scoreValue = score;
		};

		cardBoardElement.onChangeNameClick = () => {
			const id = cardBoardElement.id;
			const inputNama = prompt("Nama :");
			User.updateNamaById(id, inputNama);
			cardBoardElement.nama = inputNama;
		};
	}

	mainElement.appendChild(cardBoardElement);
}

const btnSettings = document.querySelector(".icon-setting");
const btnReset = document.querySelector(".btn-reset");
btnSettings.addEventListener("click", (e) => {
	e.preventDefault();
	btnReset.classList.toggle("hidden");
});

btnReset.addEventListener("click", (e) => {
	e.preventDefault();

	let newObj = [];
	User.objArray.forEach((user, value) => {
		user.score = 0;
		newObj.push(user);
	});

	localStorage.setItem("Users", JSON.stringify(newObj));
	const cardBoardElement = document.querySelectorAll("card-board");
	cardBoardElement.forEach((item) => (item.scoreValue = 0));

	btnReset.classList.add("hidden");
});
