import { RELATION_LIST } from "@/constants/relation";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { RefObject, startTransition, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import PeopleGroupIcon from "../icons/people-group";
import { ThemedText } from "../themed-text/themed-text";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "./bottom-sheet-wrapper";
import CustomButton from "./custom-button/custom-button";
import CustomPicker from "./custom-picker/custom-picker";

type AddProfileProps = {
  ref: RefObject<BottomSheetWrapperRef | null>;
};

interface AddProfileForm {
  name: string;
  relation: string;
}

export default function AddProfile({ ref }: AddProfileProps) {
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

  // const [addProfile, { loading }] = useMutation<ProfileResponse, AddProfileForm>({
  //   url: "/users/profiles",
  //   method: "post",
  //   config: {
  //     cache: {
  //       update: {
  //         "profile-list": (profileListCache, addProfileResponse) => {
  //           if (profileListCache.state !== "cached") {
  //             return "ignore";
  //           }

  //           // @ts-expect-error type not available
  //           profileListCache.data.data.push(addProfileResponse.data);
  //           // profileListCache.data.data = [
  //           //   ...(profileListCache.data.data as ProfileResponse[]),
  //           //   addProfileResponse.data,
  //           // ];

  //           return profileListCache;
  //         },
  //       },
  //     },
  //   },
  //   onSuccess(data) {
  //     emitCacheUpdate("profile-list");
  //     ref.current?.close();
  //   },
  // });

  const handleAddProfile = async () => {
    // await addProfile(formState);
  };

  return (
    <BottomSheetWrapper ref={ref} title="Добавить члена семьи">
      {/* <Loader visible={loading} /> */}
      <View style={styles.profileFormContainer}>
        <View style={styles.profileFormInputWrapper}>
          <ThemedText type="label">Имя</ThemedText>
          <BottomSheetTextInput
            value={formState.name}
            onChangeText={handleOnTextChange}
            style={[styles.profileFormInput, { borderColor }]}
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
