import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, ActivityIndicator, Button, TextInput, Pressable, Alert, StyleSheet } from "react-native";

export default function GamesScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  //  variáveis em espanhol porque peguei do exemplo la. Você fez as const em ingles, e eu espanhol.
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [precio, setPrecio] = useState("");

  const API = "http://177.44.248.50:8080/games";

  //  Função para carregar os dados
  async function load() {
    setLoading(true);
    const res = await fetch(API);
    const json = await res.json();

    setData(json);
    setLoading(false);
  }

  // Aqui é onde começam as brincadeiras com create.

  async function createGame() {
    // validação antes de enviar ou seja, se os campos estão vazios.
    if (!titulo.trim() || !genero.trim() || !plataforma.trim() || !precio.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos antes de continuar.");
      return;
    }

     const corpo = {
    title: titulo,
    slug: titulo.toLowerCase().replace(/\s+/g, "-"),
    genre: genero,
    platform: plataforma,
    price: Number(precio),
  };

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });

  if (!res.ok) {
    Alert.alert("Erro", "Falha ao criar jogo");
    setLoading(false);
    return;
  }

  await load();

    // limpa os campos quando são criados na caixinha de texto.
    setTitulo("");
    setGenero("");
    setPlataforma("");
    setPrecio("");
    setIdSeleccionado(null);

    setLoading(false);
  }

  // aqui começa o update
  async function updateGame() {
    if (!idSeleccionado) return;

    if (!titulo.trim() || !genero.trim() || !plataforma.trim() || !precio.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos antes de atualizar.");
      return;
    }


    setLoading(true);

    const corpo = {
    title: titulo,
    slug: titulo.toLowerCase().replace(/\s+/g, "-"),
    genre: genero,
    platform: plataforma,
    price: Number(precio),
  };

  const res = await fetch(`${API}/${idSeleccionado}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });

  if (!res.ok) {
    Alert.alert("Falha ao atualizar jogo", `Status: ${res.status}`);
    setLoading(false);
    return;
  }
    

    await load();

    // limpa os campos após atualização
    setTitulo("");
    setGenero("");
    setPlataforma("");
    setPrecio("");
    setIdSeleccionado(null);

    setLoading(false);
  }

  // aqui começa o delete
  async function deleteGame() {
    if (!idSeleccionado) return;

    setLoading(true);

    await fetch(`${API}/${idSeleccionado}`, { method: "DELETE" });

    await load();
    setIdSeleccionado(null);
    setTitulo("");
    setGenero("");
    setPlataforma("");
    setPrecio("");
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.tituloTopo}>Bem vindo ao Maets</Text>

      {/* Linha 1 ou seja as duas caixas de cima  */}
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Título..."
            style={styles.input}
          />
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Gênero</Text>
          <TextInput
            value={genero}
            onChangeText={setGenero}
            placeholder="Gênero..."
            style={styles.input}
          />
        </View>
      </View>

      {/* Linha 2 ou seja as duas caixas de baixo*/}
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Plataforma</Text>
          <TextInput
            value={plataforma}
            onChangeText={setPlataforma}
            placeholder="Plataforma..."
            style={styles.input}
          />
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Preço</Text>
          <TextInput
            value={precio}
            onChangeText={setPrecio}
            placeholder="Preço..."
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>

      {/* Botões salvar e pesquisar */}
      <View style={styles.row}>
        <Pressable style={styles.botaoPesquisar} onPress={load}>
          <Text style={styles.botaoTexto}>PESQUISAR</Text>
        </Pressable>

        <Pressable style={styles.botaoSalvar} onPress={createGame}>
          <Text style={styles.botaoTexto}>SALVAR</Text>

        </Pressable>
      </View>

      {/* Essa aqui e a caixa de lista  e todo o modelo chato dela */}
      <View style={styles.caixaLista}>
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text style={{ padding: 12 }}>Nenhum jogo.</Text>}

          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemTitulo}>{item.title}</Text>
                <Text style={styles.itemSub}>{item.genre}</Text>
                <Text style={styles.itemSub}>{item.platform}</Text>
                <Text style={styles.itemSub}>R$ {item.price}</Text>
              </View>

              <View style={styles.botaoItemCol}>
                <Pressable
                  style={styles.btnE}
                  onPress={() => {
                    setIdSeleccionado(item.id);
                    setTitulo(item.title);
                    setGenero(item.genre);
                    setPlataforma(item.platform);
                    setPrecio(String(item.price));
                    updateGame();// chama a função de update, tive que colocar aqui para funcionar direito.
                    setLoading(false);
                  }}
                >
                  <Text style={styles.btnTexto}>E</Text>
                </Pressable>

                <Pressable
                  style={styles.btnX}
                  onPress={() => {
                    setIdSeleccionado(item.id);
                    deleteGame();
                  }}
                >
                  <Text style={styles.btnTexto}>X</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
// Aqui começa o estilo, a parte chata.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: "#fff",
  },

  tituloTopo: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  inputMetade: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 10,
  },

  botaoPesquisar: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
  },
  botaoSalvar: {
    backgroundColor: "#cce5ff",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
  },
  botaoTexto: {
    textAlign: "center",
    fontWeight: "700",
  },

  caixaLista: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
    flex: 1,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  itemTitulo: { fontWeight: "700" },
  itemSub: { color: "#555" },

  botaoItemCol: { justifyContent: "center" },

  btnE: {
    backgroundColor: "#e6f0ff",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 6,
    borderRadius: 6,
  },
  btnX: {
    backgroundColor: "#ffe6e6",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnTexto: {
    fontWeight: "700",
  },

  label: {
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 14,
  },

  box: {
    width: "48%",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },

});
