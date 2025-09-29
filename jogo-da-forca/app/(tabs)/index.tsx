import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';

type StatusJogo = "ativo" | "vitoria" | "derrota";

export default function HomeScreen() {
  const palavras = [
    "REACT", "NATIVE", "JAVASCRIPT", "ANDROID", "IOS", "MOBILE", "DESENVOLVEDOR", "CODIGO",
    "COMPILADOR", "BANCO", "SERVIDOR", "CLIENTE", "COMPUTADOR", "INTERNET", "TECLADO",
    "TELA", "CELULAR", "JOGO", "FORCA", "ESCOLA", "UNIVERSIDADE", "PROGRAMA", "LINGUAGEM",
    "SISTEMA", "APLICATIVO", "ESTUDANTE", "PROFESSOR", "FRAMEWORK", "HARDWARE", "SOFTWARE"
  ];

  const [palavra, setPalavra] = useState("");
  const [letrasCertas, setLetrasCertas] = useState<string[]>([]);
  const [letrasErradas, setLetrasErradas] = useState<string[]>([]);
  const [tentativas, setTentativas] = useState(6);
  const [input, setInput] = useState("");
  const [statusJogo, setStatusJogo] = useState<StatusJogo>("ativo");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    iniciarNovoJogo();
  }, []);

  function iniciarNovoJogo() {
    const sorteada = palavras[Math.floor(Math.random() * palavras.length)];
    setPalavra(sorteada);
    setLetrasCertas([]);
    setLetrasErradas([]);
    setTentativas(6);
    setInput("");
    setStatusJogo("ativo");
    setMensagem("");
  }

  function verificarLetra() {
    if (input === "" || statusJogo !== "ativo") return;
    const letra = input.toUpperCase();

    if (letrasCertas.includes(letra) || letrasErradas.includes(letra)) {
      setInput("");
      return;
    }

    if (palavra.includes(letra)) {
      setLetrasCertas([...letrasCertas, letra]);
    } else {
      setLetrasErradas([...letrasErradas, letra]);
      setTentativas(tentativas - 1);
    }
    setInput("");
  }

  useEffect(() => {
    if (!palavra || statusJogo !== "ativo") return;

    const ganhou = palavra.split("").every((letra) => letrasCertas.includes(letra));

    if (ganhou) {
      setMensagem(`🎉 Parabéns! Você conseguiu acertar a palavra: ${palavra}. Vamos para um novo desafio?`);
      setStatusJogo("vitoria");
    } else if (tentativas === 0) {
      setMensagem(`😢 Ops! Esgotaram as tentativas e você não acertou. A palavra era: ${palavra}. Tente novamente!`);
      setStatusJogo("derrota");
    }
  }, [tentativas, letrasCertas, palavra, statusJogo]);

  function Forca({ tentativas }: { tentativas: number }) {
    return (
      <Svg height="150" width="100">
        {tentativas < 6 && <Circle cx="50" cy="20" r="10" stroke="black" strokeWidth="2" fill="none" />}
        {tentativas < 5 && <Line x1="50" y1="30" x2="50" y2="70" stroke="black" strokeWidth="2" />}
        {tentativas < 4 && <Line x1="50" y1="40" x2="30" y2="60" stroke="black" strokeWidth="2" />}
        {tentativas < 3 && <Line x1="50" y1="40" x2="70" y2="60" stroke="black" strokeWidth="2" />}
        {tentativas < 2 && <Line x1="50" y1="70" x2="30" y2="100" stroke="black" strokeWidth="2" />}
        {tentativas < 1 && <Line x1="50" y1="70" x2="70" y2="100" stroke="black" strokeWidth="2" />}
      </Svg>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>🪢 Jogo da Forca 🎮</Text>

      <View style={styles.forca}>
        <Forca tentativas={tentativas} />
      </View>

      <View style={styles.linhaPalavra}>
        {palavra.split("").map((letra, index) => (
          <Text key={index} style={styles.letra}>
            {letrasCertas.includes(letra) ? letra : ""}
          </Text>
        ))}
      </View>

      {mensagem !== "" && <Text style={styles.mensagem}>{mensagem}</Text>}

      <TextInput
        style={[styles.input, { backgroundColor: statusJogo === "ativo" ? "#fff" : "#eee" }]}
        value={input}
        onChangeText={setInput}
        editable={statusJogo === "ativo"}
        maxLength={1}
        autoCapitalize="characters"
        placeholder="Digite uma letra ✏️"
      />

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: statusJogo === "ativo" ? "#2563eb" : "#999" }]}
        onPress={verificarLetra}
        disabled={statusJogo !== "ativo"}
      >
        <Text style={styles.textoBotao}>Tentar ✅</Text>
      </TouchableOpacity>

      <Text style={styles.info}>💡 Tentativas restantes: {tentativas}</Text>
      <Text style={styles.info}>❌ Letras erradas: {letrasErradas.join(", ")}</Text>

      <TouchableOpacity style={styles.botaoReiniciar} onPress={iniciarNovoJogo}>
        <Text style={styles.textoBotao}>🔄 Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 20,
    textAlign: "center",
  },
  forca: {
    marginBottom: 20,
    alignItems: "center",
  },
  linhaPalavra: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  letra: {
    fontSize: 32,
    color: "#2563eb", // azul forte
    marginHorizontal: 6,
    width: 30,
    textAlign: "center",
    borderBottomWidth: 3,
    borderColor: "#000",
    fontWeight: "600",
  },
  input: {
    borderWidth: 2,
    borderColor: "#2563eb",
    padding: 12,
    marginBottom: 10,
    width: 220,
    textAlign: "center",
    fontSize: 22,
    color: "black",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  botao: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  botaoReiniciar: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  info: {
    fontSize: 17,
    marginTop: 8,
    color: "#333",
  },
  mensagem: {
    fontSize: 18,
    color: "#dc2626",
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "600",
  },
});
