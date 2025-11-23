import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, ActivityIndicator, Button, TextInput, Pressable, Alert, StyleSheet } from "react-native";

export default function GamesScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");

  // 👉 GET
  async function load() {
    setLoading(true);
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const json = await res.json();

    // adapta para "jogos"
    const games = json.map((item) => ({
      id: item.id,
      title: item.title,
      genre: item.body, // body vira "genero"
    }));

    setData(games);
    setLoading(false);
  }

  //  POST
  async function createGame() {
    setLoading(true);
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body: genre }),
    });

    const created = await res.json();
    if (created) {
      await load();
      setSelectedId(created.id || null);
    } else {
      Alert.alert("Falha no POST", `Status: ${res.status}`);
    }
    setLoading(false);
  }

  //  PUT
  async function updateGame() {
    if (!selectedId) return;
    setLoading(true);

    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId, title, body: genre }),
    });

    if (res.ok) {
      await load();
    } else {
      Alert.alert("Falha no PUT", `Status: ${res.status}`);
    }
    setLoading(false);
  }

  //  DELETE
  async function deleteGame() {
    if (!selectedId) return;
    setLoading(true);

    await fetch(`https://jsonplaceholder.typicode.com/posts/${selectedId}`, {
      method: "DELETE",
    });

    await load();
    setSelectedId(null);
    setTitle("");
    setGenre("");
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Games </Text>

      <Button title="Carregar Games " onPress={load} />

      <Text style={{ marginTop: 8 }}>ID selecionado: {selectedId ?? "-"}</Text>

      <Text style={{ marginTop: 8 }}>Título do jogo</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Digite o nome do jogo"
      />

      <Text style={{ marginTop: 8 }}>Gênero</Text>
      <TextInput
        value={genre}
        onChangeText={setGenre}
        style={[styles.input, { minHeight: 64, textAlignVertical: "top" }]}
        placeholder="Digite o gênero"
        multiline
      />

      <View style={styles.buttonRow}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <Button title="Criar " onPress={createGame} disabled={loading} />
        </View>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <Button title="Atualizar " onPress={updateGame} disabled={loading || !selectedId} />
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="Excluir " onPress={deleteGame} disabled={loading || !selectedId} />
      </View>

      {loading ? (
        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Carregando…</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text>Nenhum jogo carregado.</Text>}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedId;
            return (
              <Pressable
                onPress={() => {
                  setSelectedId(item.id);
                  setTitle(item.title);
                  setGenre(item.genre);
                }}
                style={[styles.item, isSelected && styles.itemSelected]}
              >
                <Text style={{ fontWeight: "700" }}>
                  {item.id}. {item.title}
                </Text>
                <Text style={{ color: "#555" }}>{item.genre}</Text>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    padding: 16 
  },
  header: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 8 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    padding: 8, 
    borderRadius: 6 
  },
  buttonRow: { 
    flexDirection: "row", 
    marginTop: 12 
  },
  item: { 
    paddingVertical: 10 
  },
  itemSelected: { 
    backgroundColor: "#eef" 
  },
});