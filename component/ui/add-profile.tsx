import { RELATION_LIST } from "@/constants/relation";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { ProfileResponse } from "@/types/user";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import { RefObject, startTransition, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import PeopleGroupIcon from "../icons/people-group";
import { ThemedText } from "../themed-text/themed-text";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "./bottom-sheet-wrapper";
import CustomButton from "./custom-button/custom-button";
import CustomPicker from "./custom-picker/custom-picker";
import Loader from "./loader";

type AddProfileProps = {
  ref: RefObject<BottomSheetWrapperRef | null>;
};

interface AddProfileForm {
  name: string;
  relation: string;
}

const addRelationProfileMutation = async (data: AddProfileForm) => {
  const response = await api.post<ProfileResponse>("users/profiles", data);
  return response.data;
};

export default function AddProfile({ ref }: AddProfileProps) {
  const { showFeedBack } = useFeedBackStore();
  const [formState, setFormState] = useState<AddProfileForm>({
    name: "",
    relation: "",
  });

  const canSubmit = useMemo(() => {
    const { name, relation } = formState;
    return Boolean(name) && Boolean(relation);
  }, [formState]);

  // @platform IOS ONLY
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  // @platform IOS ONLY
  const triggerSelectionPicker = () => {
    setIsPickerVisible(!isPickerVisible);
    if (!formState.relation) {
      setFormState((prv) => ({ ...prv, relation: RELATION_LIST[0].value }));
    }
  };

  const textColor = useThemeColor({}, "textPrimary");
  const borderColor = useThemeColor({}, "borderColor");

  const handleOnRelationSelected = (relation: string) => {
    startTransition(() => {
      setFormState((prv) => ({ ...prv, relation: relation }));
    });
  };

  const handleOnTextChange = (text: string) => {
    setFormState((prv) => ({ ...prv, name: text }));
  };

  const { isPending, mutate } = useMutation({
    mutationFn: addRelationProfileMutation,
    onSuccess(data) {
      queryClient.setQueryData(["profiles"], (existingData: ProfileResponse[]) =>
        existingData ? [...existingData, data] : [data],
      );
      showFeedBack({
        title: "Добавлено отношение!",
        message: "Успешно добавлено новое отношение!",
        status: "success",
      });
      ref.current?.close();
      setFormState({ name: "", relation: "" });
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        console.log("An axios error occur when creating relatiion profile -> ", error);
      } else {
        console.log("An unknown error occur when creating relatiion profile -> ", error);
      }
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте еще раз!",
        status: "error",
      });
    },
  });

  const handleAddProfile = async () => {
    mutate(formState);
  };

  return (
    <BottomSheetWrapper ref={ref} title="Добавить члена семьи">
      <ScrollView contentContainerStyle={{ height: 700 }}>
        <View style={styles.profileFormContainer}>
          <View style={styles.profileFormInputWrapper}>
            <ThemedText type="label">Имя</ThemedText>
            <BottomSheetTextInput
              value={formState.name}
              onChangeText={handleOnTextChange}
              style={[styles.profileFormInput, { borderColor, color: textColor }]}
              autoCorrect={false}
              autoCapitalize="sentences"
              keyboardType="default"
              placeholder="Введите имя"
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <CustomPicker
            label="Отношения"
            selectedValue={formState.relation}
            items={RELATION_LIST}
            svgIcon={<PeopleGroupIcon color={textColor} />}
            onValueSelected={handleOnRelationSelected}
            isSelectionVisible={isPickerVisible}
            triggerSelection={triggerSelectionPicker}
          />

          <CustomButton
            label="Добавить нового члена"
            variant={canSubmit ? "filled" : "disabled"}
            textVaraint={canSubmit ? "regularText" : "mutedText"}
            style={styles.button}
            disabled={!canSubmit}
            onPress={handleAddProfile}
          />
        </View>
      </ScrollView>
      <Loader visible={isPending} />
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  profileFormContainer: {
    gap: 16,
  },
  profileFormInputWrapper: {
    gap: 8,
  },
  profileFormInput: {
    borderWidth: 1,
    borderRadius: 16,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    padding: 16,
    lineHeight: 19.2,
  },
  button: {
    marginTop: 20,
  },
});
