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

let currentEditId = null;

// ユーザー一覧を表示する関数
async function displayUsers() {
  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ユーザー取得エラー:", error);
    return;
  }

  userTableBody.innerHTML = data
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

// 新規ユーザー登録
submitButton.addEventListener("click", async () => {
  const name = nameInput.value;
  const email = emailInput.value;

  if (!name || !email) {
    alert("名前とメールアドレスを入力してください");
    return;
  }

  try {
    const { error } = await supabaseClient
      .from("users")
      .insert([{ name, email }]);

    if (error) throw error;

    alert("ユーザーを登録しました！");
    nameInput.value = "";
    emailInput.value = "";
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
