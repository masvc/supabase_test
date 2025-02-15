// Supabaseクライアントの初期化
const supabaseClient = supabase(config.supabaseUrl, config.supabaseKey);

// 接続テスト用関数
const checkConnection = async () => {
  console.log("Supabase接続テスト開始...");
  const { data, error } = await supabaseClient.from("users").select("*");
  if (error) {
    console.error("データ取得エラー:", error);
  } else {
    console.log("取得したユーザーデータ:", data);
  }
};

// 接続テストを実行
checkConnection();

// DOM要素の取得
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const submitButton = document.getElementById("submitButton");
const userTableBody = document.getElementById("userTableBody");
const editModal = document.getElementById("editModal");
const editNameInput = document.getElementById("editName");
const editEmailInput = document.getElementById("editEmail");
const saveEditButton = document.getElementById("saveEdit");
const cancelEditButton = document.getElementById("cancelEdit");
const searchInput = document.getElementById("searchInput");
const sortNameToggle = document.getElementById("sortNameToggle");

let currentEditId = null;
let currentUsers = []; // ユーザーデータのキャッシュ
let currentSortOrder = "desc"; // デフォルトは降順

// ユーザー一覧を表示する関数
async function displayUsers(searchQuery = "") {
  try {
    let query = supabaseClient.from("users").select("*");

    // ソート順の適用
    query = query.order("name", { ascending: currentSortOrder === "asc" });

    const { data, error } = await query;

    if (error) {
      console.error("ユーザー取得エラー:", error);
      return;
    }

    // 検索クエリでフィルタリング
    currentUsers = data.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    });

    // テーブルの更新
    updateTable();
  } catch (error) {
    console.error("エラー:", error);
  }
}

// テーブル更新関数
function updateTable() {
  userTableBody.innerHTML = currentUsers
    .map(
      (user) => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${new Date(user.created_at).toLocaleString()}</td>
      <td class="action-buttons">
        <button class="edit" onclick="window.editUser('${user.id}', '${
        user.name
      }', '${user.email}')">
          編集
        </button>
        <button class="delete" onclick="window.deleteUser('${user.id}')">
          削除
        </button>
      </td>
    </tr>
  `
    )
    .join("");
}

// 検索機能の実装
searchInput.addEventListener("input", (e) => {
  const searchQuery = e.target.value;
  displayUsers(searchQuery);
});

// ソートボタンのイベントリスナー
sortNameToggle.addEventListener("click", () => {
  currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
  const arrow = currentSortOrder === "asc" ? "▲" : "▼";
  sortNameToggle.textContent = `${arrow} あいうえお順`;
  displayUsers(searchInput.value);
});

// バリデーション関数
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateName(name) {
  return name.length >= 1 && name.length <= 50;
}

function showError(input, message) {
  const formGroup = input.parentElement;
  formGroup.classList.add("error");
  const errorMessage = formGroup.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

function clearError(input) {
  const formGroup = input.parentElement;
  formGroup.classList.remove("error");
}

// 入力フィールドのバリデーション設定
nameInput.addEventListener("input", () => {
  if (validateName(nameInput.value)) {
    clearError(nameInput);
  } else {
    showError(nameInput, "名前は1文字以上50文字以下で入力してください");
  }
});

emailInput.addEventListener("input", () => {
  if (validateEmail(emailInput.value)) {
    clearError(emailInput);
  } else {
    showError(emailInput, "有効なメールアドレスを入力してください");
  }
});

// 新規ユーザー登録（バリデーション処理を追加）
submitButton.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  // 入力値の検証
  let isValid = true;

  if (!validateName(name)) {
    showError(nameInput, "名前は1文字以上50文字以下で入力してください");
    isValid = false;
  }

  if (!validateEmail(email)) {
    showError(emailInput, "有効なメールアドレスを入力してください");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  try {
    // メールアドレスの重複チェック
    const { data: existingUser } = await supabaseClient
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      showError(emailInput, "このメールアドレスは既に登録されています");
      return;
    }

    const { error } = await supabaseClient
      .from("users")
      .insert([{ name, email }]);

    if (error) throw error;

    alert("ユーザーを登録しました！");
    nameInput.value = "";
    emailInput.value = "";
    clearError(nameInput);
    clearError(emailInput);
    displayUsers(); // テーブルを更新
  } catch (error) {
    console.error("エラー:", error.message);
    alert(error.message);
  }
});

// ユーザー編集モーダルを開く
window.editUser = (id, name, email) => {
  currentEditId = id;
  editNameInput.value = name;
  editEmailInput.value = email;
  editModal.style.display = "block";
};

// ユーザー編集をキャンセル
cancelEditButton.addEventListener("click", () => {
  editModal.style.display = "none";
  currentEditId = null;
});

// ユーザー情報を更新
saveEditButton.addEventListener("click", async () => {
  if (!currentEditId) return;

  const name = editNameInput.value;
  const email = editEmailInput.value;

  try {
    const { error } = await supabaseClient
      .from("users")
      .update({ name, email })
      .eq("id", currentEditId);

    if (error) throw error;

    alert("ユーザー情報を更新しました！");
    editModal.style.display = "none";
    currentEditId = null;
    displayUsers(); // テーブルを更新
  } catch (error) {
    console.error("エラー:", error.message);
    alert(error.message);
  }
});

// ユーザーを削除
window.deleteUser = async (id) => {
  if (!confirm("このユーザーを削除してもよろしいですか？")) {
    return;
  }

  try {
    const { error } = await supabaseClient.from("users").delete().eq("id", id);

    if (error) throw error;

    alert("ユーザーを削除しました");
    displayUsers(); // テーブルを更新
  } catch (error) {
    console.error("エラー:", error.message);
    alert(error.message);
  }
};

// 初期表示時にユーザー一覧を取得
displayUsers();
