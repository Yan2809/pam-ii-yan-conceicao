import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [nomeTarefa, setNomeTarefa] = useState('');
  const [tarefaEditando, setTarefaEditando] = useState(null);

  useEffect(() => {
    const carregarTarefas = async () => {
      const snapshot = await getDocs(collection(db, 'tasks'));
      const tarefasCarregadas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTarefas(tarefasCarregadas);
    };
    carregarTarefas();
  }, []);

  const adicionarTarefa = async () => {
    if (nomeTarefa.trim()) {
      const docRef = await addDoc(collection(db, 'tasks'), { name: nomeTarefa });

      setTarefas((tarefasAnteriores) => [...tarefasAnteriores, { id: docRef.id, name: nomeTarefa }]);
      setNomeTarefa('');
    } else {
      Alert.alert('Erro', 'Por favor, insira o nome da tarefa.');
    }
  };

  const atualizarTarefa = async () => {
    if (nomeTarefa.trim() && tarefaEditando) {
      const tarefaRef = doc(db, 'tasks', tarefaEditando.id);
      await updateDoc(tarefaRef, { name: nomeTarefa });

      setTarefas((tarefasAnteriores) =>
        tarefasAnteriores.map((t) => (t.id === tarefaEditando.id ? { ...t, name: nomeTarefa } : t))
      );

      setNomeTarefa('');
      setTarefaEditando(null);
    }
  };

  const excluirTarefa = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
    setTarefas(tarefas.filter((t) => t.id !== id));
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Gerenciador de Tarefas</Text>
      <TextInput
        style={estilos.input}
        placeholder="Digite a tarefa"
        placeholderTextColor="#888"
        value={nomeTarefa}
        onChangeText={setNomeTarefa}
      />
      <TouchableOpacity
        style={[estilos.botao, { backgroundColor: tarefaEditando ? '#f39c12' : '#27ae60' }]}
        onPress={tarefaEditando ? atualizarTarefa : adicionarTarefa}
      >
        <Text style={estilos.textoBotao}>{tarefaEditando ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}</Text>
      </TouchableOpacity>
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={estilos.itemTarefa}>
            <Text style={estilos.textoTarefa}>{item.name}</Text>
            <View style={estilos.botoes}>
              <TouchableOpacity
                style={[estilos.botaoAcao, { backgroundColor: '#2980b9' }]}
                onPress={() => {
                  setNomeTarefa(item.name);
                  setTarefaEditando(item);
                }}
              >
                <Text style={estilos.textoAcao}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[estilos.botaoAcao, { backgroundColor: '#e74c3c' }]}
                onPress={() => excluirTarefa(item.id)}
              >
                <Text style={estilos.textoAcao}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140c1c',
    padding: 20,
    paddingTop: 150,
  },
  titulo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#1e1e2f',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  botao: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemTarefa: {
    backgroundColor: '#1e1e2f',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoTarefa: {
    color: '#fff',
    fontSize: 16,
  },
  botoes: {
    flexDirection: 'row',
  },
  botaoAcao: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 5,
  },
  textoAcao: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
