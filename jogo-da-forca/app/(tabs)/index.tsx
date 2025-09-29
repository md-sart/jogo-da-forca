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
      setMensagem(`Parabéns! Você conseguiu acertar a palavra: ${palavra}. Vamos para um novo desafio?`);
      setStatusJogo("vitoria");
    } else if (tentativas === 0) {
      setMensagem(`Ops! Esgotaram as tentativas e você não acertou. A palavra era: ${palavra}. Tente novamente!`);
      setStatusJogo("derrota");
    }
  }, [tentativas, letrasCertas, palavra, statusJogo]);

  function exibirPalavra() {
    return palavra
      .split("")
      .map((letra) => (letrasCertas.includes(letra) ? letra : "_"))
      .join(" ");
  }

  function Forca({ tentativas }: { tentativas: number }) {
    return (
      <Svg height="150" width="100">
        {tentativas < 6 && <Circle cx="50" cy="20" r="10" stroke="black" strokeWidth="2" fill="black" />}
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
      <View style={styles.forca}>
        <Forca tentativas={tentativas} />
      </View>

      <Text style={styles.palavra}>{exibirPalavra()}</Text>

      {mensagem !== "" && <Text style={styles.mensagem}>{mensagem}</Text>}

      <TextInput
        style={[styles.input, { backgroundColor: statusJogo === "ativo" ? "#fff" : "#ccc" }]}
        value={input}
        onChangeText={setInput}
        editable={statusJogo === "ativo"}
        maxLength={1}
        autoCapitalize="characters"
        placeholder="Digite uma letra"
      />

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: statusJogo === "ativo" ? "#654321" : "#999" }]}
        onPress={verificarLetra}
        disabled={statusJogo !== "ativo"}
      >
        <Text style={styles.textoBotao}>Tentar</Text>
      </TouchableOpacity>

      <Text style={styles.info}>Tentativas restantes: {tentativas}</Text>
      <Text style={styles.info}>Letras erradas: {letrasErradas.join(", ")}</Text>

      <TouchableOpacity style={styles.botaoReiniciar} onPress={iniciarNovoJogo}>
        <Text style={styles.textoBotao}>Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8e7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  forca: {
    marginBottom: 20,
    alignItems: "center",
  },
  palavra: {
    fontSize: 32,
    letterSpacing: 4,
    color: "#654321",
    marginVertical: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "#654321",
    padding: 10,
    marginBottom: 10,
    width: 200,
    textAlign: "center",
    fontSize: 20,
    color: "black",
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  botao: {
    backgroundColor: "#654321",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  botaoReiniciar: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 18,
  },
  info: {
    fontSize: 16,
    marginTop: 10,
    color: "black",
  },
  mensagem: {
    fontSize: 18,
    color: "#654321",
    textAlign: "center",
    marginVertical: 15,
  },
});
 