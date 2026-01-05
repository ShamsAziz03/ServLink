import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

const Colors = {
    primary: "#6c3483",
    secondary: "#A78BFA",
    background: "#fff",
    card: "#6c3483",
    textSecondary: "#D1D5DB",
    softPurple: "#F3E8FF",
};

export default function CategoriesScreen() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editImage, setEditImage] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

      const ip = process.env.EXPO_PUBLIC_IP;
    const fetchCategories = async () => {
        const res = await axios.get(`http://${ip}:5000/api/categories`);
        setCategories(res.data);
    };

    const pickImage = async (setImageFn) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageFn(result.assets[0].uri);
        }
    };

    const addCategory = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("cover_image", {
            uri: image,
            name: "category.jpg",
            type: "image/jpeg",
        });

<<<<<<< HEAD
        await axios.post("http://192.168.1.12:5000/api/addCategory", formData, {
=======
        await axios.post(`http://${ip}:5000/api/addCategory`, formData, {
>>>>>>> fb2728f8afa0df6127a6d270d2d743c07b1b16d3
            headers: { "Content-Type": "multipart/form-data" },
        });

        setAddModalVisible(false);
        setName("");
        setDescription("");
        setImage(null);
        fetchCategories();
    };

    const openEditModal = (category) => {
        setEditCategoryId(category.category_id);
        setEditName(category.name);
        setEditDescription(category.description);
        setEditImage(category.cover_image);
        setEditModalVisible(true);
    };

    const saveEditCategory = async () => {
  try {
    if (!editCategoryId || !editName || !editDescription) {
      console.log("Missing fields");
      return;
    }

    const formData = new FormData();
    formData.append("category_id", editCategoryId);
    formData.append("name", editName);
    formData.append("description", editDescription);

    if (editImage && !editImage.startsWith("http")) {
      formData.append("cover_image", {
        uri: editImage.startsWith("file://") ? editImage : "file://" + editImage,
        name: "category.jpg",
        type: "image/jpeg",
      });
    }

    console.log("Sending formData:", formData);

<<<<<<< HEAD
    await axios.put(`http://192.168.1.12:5000/api/updateCategory`, formData, {
=======
    await axios.put(`http://${ip}:5000/api/updateCategory`, formData, {
>>>>>>> fb2728f8afa0df6127a6d270d2d743c07b1b16d3
      headers: { "Content-Type": "multipart/form-data" },
    });

    setEditModalVisible(false);
    setEditCategoryId(null);
    setEditName("");
    setEditDescription("");
    setEditImage(null);
    fetchCategories();
  } catch (err) {
    console.log("Error updating category:", err.response?.data || err.message);
  }
};


    const filtered = categories.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.cover_image }} style={styles.image} />
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => openEditModal(item)}>
                <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Categories</Text>
                <TouchableOpacity style={styles.addBtnHeader} onPress={() => setAddModalVisible(true)}>
                    <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="Search category..."
                value={search}
                onChangeText={setSearch}
                style={styles.search}
            />

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.category_id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* Add Category Modal */}
            <Modal visible={addModalVisible} animationType="slide">
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Add Category</Text>

                    <TextInput
                        placeholder="Category Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.imageBtn} onPress={() => pickImage(setImage)}>
                        <Text style={{ color: "#fff" }}>Pick Image</Text>
                    </TouchableOpacity>

                    {image && <Image source={{ uri: image }} style={styles.preview} />}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.saveBtn, { flex: 1, marginRight: 5 }]}
                            onPress={addCategory}
                        >
                            <Text style={{ color: "#fff", textAlign: "center" }}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.cancelBtn, { flex: 1, marginLeft: 5 }]}
                            onPress={() => setAddModalVisible(false)}
                        >
                            <Text style={{ color: "#fff", textAlign: "center" }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Edit Category Modal */}
            <Modal visible={editModalVisible} animationType="slide">
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Edit Category</Text>

                    <TextInput
                        placeholder="Category Name"
                        value={editName}
                        onChangeText={setEditName}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Description"
                        value={editDescription}
                        onChangeText={setEditDescription}
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.imageBtn} onPress={() => pickImage(setEditImage)}>
                        <Text style={{ color: "#fff" }}>Pick Image</Text>
                    </TouchableOpacity>

                    {editImage && <Image source={{ uri: editImage }} style={styles.preview} />}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.saveBtn, { flex: 1, marginRight: 5 }]}
                            onPress={saveEditCategory}
                        >
                            <Text style={{ color: "#fff", textAlign: "center" }}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.cancelBtn, { flex: 1, marginLeft: 5 }]}
                            onPress={() => setEditModalVisible(false)}
                        >
                            <Text style={{ color: "#fff", textAlign: "center" }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.primary,
    },
    addBtnHeader: {
        backgroundColor: Colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    search: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    card: {
        flexDirection: "row",
        backgroundColor: Colors.card,
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
        alignItems: "center",
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    desc: {
        color: Colors.textSecondary,
        fontSize: 13,
    },
    modal: {
        flex: 1,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.primary,
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    imageBtn: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    preview: {
        width: "100%",
        height: "250",
        borderRadius: 10,
        marginVertical: 10,
    },
    modalButtons: {
        flexDirection: "row",
        marginTop: 10,
    },
    saveBtn: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelBtn: {
        backgroundColor: "red",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
});
