import { QueryKey } from "@/constants/query-keys";
import { relationList } from "@/constants/relation";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { useFeedBackStore } from "@/stores/feedback-store";
import { ProfileResponse } from "@/types/user";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import { startTransition, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import PeopleGroupIcon from "../icons/people-group";
import { ThemedText } from "../themed-text/themed-text";
import CustomButton from "./custom-button/custom-button";
import CustomPicker from "./custom-picker/custom-picker";
import Loader from "./loader";

type AddProfileProps = {
  onProfileAdded: (profileId: string) => void;
};
interface AddProfileForm {
  name: string;
  relation: string;
}

const addRelationProfileMutation = async (data: AddProfileForm) => {
  const response = await api.post<ProfileResponse>("users/profiles", data);
  return response.data;
};

export default function AddProfile({ onProfileAdded }: AddProfileProps) {
  const { t, i18n } = useTranslation();

  const RELATION_LIST = relationList(i18n.language);

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
      queryClient.setQueryData([QueryKey.profiles], (existingData: ProfileResponse[]) =>
        existingData ? [...existingData, data] : [data],
      );
      onProfileAdded(data.id);
      showFeedBack({
        title: t("feedback.success.add_new_profile.title"),
        message: t("feedback.success.add_new_profile.text"),
        status: "success",
      });
      setFormState({ name: "", relation: "" });
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: t("feedback.error.network.title"),
            message: t("feedback.error.network.text"),
            status: "error",
          });
        } else {
          showFeedBack({
            title: t("feedback.error.general.title"),
            message: t("feedback.error.general.text"),
            status: "error",
          });
        }
      }
    },
  });

  const handleAddProfile = async () => {
    mutate(formState);
  };

  return (
    <View style={{ height: 600 }}>
      <ScrollView>
        <View style={styles.profileFormContainer}>
          <View style={styles.profileFormInputWrapper}>
            <ThemedText type="label">{t("add_profile_sheet.input_label")}</ThemedText>
            <BottomSheetTextInput
              value={formState.name}
              onChangeText={handleOnTextChange}
              style={[styles.profileFormInput, { borderColor, color: textColor }]}
              autoCorrect={false}
              autoCapitalize="sentences"
              keyboardType="default"
              placeholder={t("add_profile_sheet.input_placeholder")}
              placeholderTextColor="#9E9E9E"
            />
          </View>
          <CustomPicker
            label={t("add_profile_sheet.picker_label")}
            selectedValue={formState.relation}
            items={RELATION_LIST}
            svgIcon={<PeopleGroupIcon color={textColor} />}
            onValueSelected={handleOnRelationSelected}
            isSelectionVisible={isPickerVisible}
            triggerSelection={triggerSelectionPicker}
          />

          <CustomButton
            label={t("add_profile_sheet.button_label")}
            variant={canSubmit ? "filled" : "disabled"}
            textVaraint={canSubmit ? "regularText" : "mutedText"}
            style={styles.button}
            disabled={!canSubmit}
            onPress={handleAddProfile}
          />
        </View>
        <Loader visible={isPending} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  profileFormContainer: {
    gap: 32,
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
