import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, Button, TextInput, Pressable, Alert, StyleSheet } from "react-native";

export default function GamesScreen() {
  const [gamesList, setGamesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Constantes para os campos de texto.
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [price, setPrice] = useState("");

  // Constante para o texto da busca, se ta funcionando ou não. Ai ja e outra historia.
  const [searchText, setSearchText] = useState("");

  // A API que estou usando que o sor pediu. pq eu coloquei aqui em cima? Esse metodo é melhor para fazer manutenção no codigo.
  const API = "http://177.44.248.50:8080/games";

  // Carrega lista automática ao abrir tela
  useEffect(() => {
    loadGames();
  }, [searchText]);

  //  Função para carregar os dados
  async function loadGames() {
    setLoading(true);
    let url = API;

    // Se houver algo digitado na busca, chama o endereço de busca
    if (searchText.trim()) {
      url = `http://177.44.248.50:8080/games/search?q=${encodeURIComponent(searchText)}`;
    }
    // se der erro na requisição, mostra um alerta
    try {
      const res = await fetch(url);
      const json = await res.json();
      setGamesList(json);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar jogos");
    }

    setLoading(false);
  }

  
  
  
  // Aqui é onde começam as brincadeiras com criar.
  async function createGame() {
    if (loading) return;

    // validação antes de enviar
    if (!title.trim() || !genre.trim() || !platform.trim() || !price.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos antes de continuar.");
      return;
    }

    // Decidi montar o JSON do body antes do fetch pra deixar o código mais claro.
    // Achei mais legal fazer assim do que colocar tudo direto dentro do JSON.stringify.
    // Se um dia eu querer fazer alguma modificação no codigo e mais facil.
    const body = {
      title: title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      genre: genre,
      platform: platform,
      price: Number(price),
    };
    // Aqui lança alerta de sucesso ou falha, se não der certo mostra o erro.
    try {
      setLoading(true);

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      Alert.alert("Jogo salvo com sucesso!");

      if (!res.ok) throw new Error("Falha ao criar jogo");

      await loadGames();

      // Limpa os campos quando são criados na caixinha de texto.
      setTitle("");
      setGenre("");
      setPlatform("");
      setPrice("");
      setSelectedId(null);
      setSearchText("");

    } catch (error) {
      Alert.alert("Erro", error.message);
    }

    setLoading(false);
  }

  
  
  
  // Aqui começa o update(atualizar).
  async function updateGame() {
    //Toda vez que for atualizar, tem que ter um jogo selecionado.
    if (!selectedId || loading) return;

    if (!title.trim() || !genre.trim() || !platform.trim() || !price.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos antes de atualizar.");
      return;
    }

    setLoading(true);

    // Aqui foi a mesma coisa la de cima, montar o body antes do fetch.
    const body = {
      title: title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),// aqui é mais por estetica, se eu tirar ele funciona igual.Mas o sor comentou que era obrigatorio entao ok.
      genre: genre,
      platform: platform,
      price: Number(price),
    };

    try {
      const res = await fetch(`${API}/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Falha ao atualizar jogo (status ${res.status})`);

      Alert.alert("Atualizado com sucesso!");

      await loadGames();

      setTitle("");
      setGenre("");
      setPlatform("");
      setPrice("");
      setSelectedId(null);
      setSearchText("");

    } catch (error) {
      Alert.alert("Erro", error.message);
    }

    setLoading(false);
  }

 
 
  // Aqui começa o delete
  async function deleteGame() {
    if (!selectedId || loading) return;
    //Aqui é um alerda de confirmação.
    //Ele pede confirmação antes de deletar    
    Alert.alert(
      "Excluir",
      "Tem certeza que deseja excluir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: confirmDelete }
      ]
    );
  }

  // Função que confirma o delete
  async function confirmDelete() {
    setLoading(true);
    // Se tirar a confirmção funciona igual 



    try {
      // Aqui ele faz  o funcionamento para deletar
      await fetch(`${API}/${selectedId}`, { method: "DELETE" });
      await loadGames();

      setSelectedId(null);
      setTitle("");
      setGenre("");
      setPlatform("");
      setPrice("");
      setSearchText("");
      Alert.alert("jogo deletado com sucesso!");

    } catch (error) {
      Alert.alert("Erro", "Falha ao deletar jogo");
    }

    setLoading(false);
  }

  // Aqui começa o retorno da tela
  return (
    <SafeAreaView style={styles.container}>
      {/*Título no topo/*/}
      <Text style={styles.tituloTopo}>Bem vindo ao Maets</Text>

      {/* Campo de busca */}
      <View style={styles.row}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Pesquisar jogo..."
          style={[styles.input, { flex: 1 }]}
        />
        <Pressable
          style={[styles.botaoPesquisar, { marginLeft: 8, flex: 0 }]}
          onPress={loadGames}
          disabled={loading}
        >
          <Text style={styles.botaoTexto}>{loading ? "..." : "BUSCAR"}</Text>
        </Pressable>
      </View>

      {/* Linha 1 */}
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título..."
            style={styles.input}
          />
        </View>
        {/* segunda caixinha */}
        <View style={styles.box}>
          <Text style={styles.label}>Gênero</Text>
          <TextInput
            value={genre}
            onChangeText={setGenre}
            placeholder="Gênero..."
            style={styles.input}
          />
        </View>
      </View>

      {/* Linha 2 */}
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Plataforma</Text>
          <TextInput
            value={platform}
            onChangeText={setPlatform}
            placeholder="Plataforma..."
            style={styles.input}
          />
        </View>
        {/* segunda caixinha */}
        <View style={styles.box}>
          <Text style={styles.label}>Preço</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="Preço..."
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>

      {/* Botões salvar e atualizar */}
      <View style={styles.row}>
        <Pressable
          style={styles.botaoSalvar}
          onPress={createGame}
          disabled={loading}
        >
          <Text style={styles.botaoTexto}>{loading ? "..." : "SALVAR"}</Text>
        </Pressable>

        <Pressable
          style={styles.botaoSalvar}
          onPress={updateGame}
          disabled={loading}
        >
          <Text style={styles.botaoTexto}>{loading ? "..." : "ATUALIZAR"}</Text>
        </Pressable>
      </View>

      {/* Lista */}
      <View style={styles.caixaLista}>
        <FlatList
          data={gamesList}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text style={{ padding: 12 }}>Nenhum jogo.</Text>}
          renderItem={({ item }) => (
            <View style={[
              styles.itemRow,
              selectedId === item.id && { backgroundColor: "#eef" }
            ]}>
              <View>
                <Text style={styles.itemTitulo}>{item.title}</Text>
                <Text style={styles.itemSub}>{item.genre}</Text>
                <Text style={styles.itemSub}>{item.platform}</Text>
                <Text style={styles.itemSub}>R$ {Number(item.price).toFixed(2)}</Text>
              </View>

              <View style={styles.botaoItemCol}>
                <Pressable
                  style={styles.btnE}
                  onPress={() => {
                    setSelectedId(item.id);
                    setTitle(item.title);
                    setGenre(item.genre);
                    setPlatform(item.platform);
                    setPrice(String(item.price));
                  }}
                >
                  <Text style={styles.btnTexto}>E</Text>
                </Pressable>

                <Pressable
                  style={styles.btnX}
                  onPress={() => {
                    setSelectedId(item.id);
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
    backgroundColor: "#fff",
    padding: 16
  },

  tituloTopo: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    textAlign: "center"
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },

  box: {
    width: "48%"
  },

  label: {
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 14
  },

  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    padding: 8,
    borderRadius: 6,
    fontSize: 16
  },

  botaoPesquisar: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    borderWidth: 1
  },

  botaoSalvar: {
    backgroundColor: "#cce5ff",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    borderWidth: 1
  },

  botaoTexto: {
    textAlign: "center",
    fontWeight: "700"
  },

  caixaLista: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
    flex: 1
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },

  itemTitulo: {
    fontWeight: "700"
  },

  itemSub: {
    color: "#555"
  },

  botaoItemCol: {
    justifyContent: "center"
  },

  btnE: {
    backgroundColor: "#e6f0ff",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 6,
    borderRadius: 6
  },

  btnX: {
    backgroundColor: "#ffe6e6",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6
  },

  btnTexto: {
    fontWeight: "700"
  },
});
