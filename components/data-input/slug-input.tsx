import { useDebounce } from "@uidotdev/usehooks";
import { EditIcon, LockIcon, RefreshCwIcon } from "lucide-react";
import { useLocale } from "next-intl";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type {
  SlugForEntityInputSchema,
  SlugForEntityOutputSchema,
} from "@/lib/dto/slug";
import type { FormComponentProps } from "@/lib/types/form";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

async function generateSlug(input: {
  entityName: string;
  fieldName: string;
  inputValue: string;
  entityId?: string;
}) {
  const response = await fetch("/api/slug-for-entity", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      entityName: input.entityName,
      fieldName: input.fieldName,
      inputValue: input.inputValue,
      entityId: input.entityId,
    } satisfies SlugForEntityInputSchema),
  });

  if (!response.ok) {
    throw new Error("Failed to generate slug");
  }

  return (await response.json()) as SlugForEntityOutputSchema;
}

function resolveWatchFieldPath(
  currentFieldName: string,
  watchFieldName: string,
  formValues: any,
  contentLanguage: string,
): string {
  const translationsMatch = currentFieldName.match(/^translations\.(\d+)\./);

  if (translationsMatch) {
    const index = translationsMatch[1];

    if (formValues?.translations?.[index]?.hasOwnProperty(watchFieldName)) {
      return `translations.${index}.${watchFieldName}`;
    }

    if (formValues?.hasOwnProperty(watchFieldName)) {
      return watchFieldName;
    }

    return `translations.${index}.${watchFieldName}`;
  }

  if (Array.isArray(formValues?.translations)) {
    const index = formValues.translations.findIndex(
      (t: any) => t.languageCode === contentLanguage,
    );

    if (
      index >= 0 &&
      formValues.translations[index]?.hasOwnProperty(watchFieldName)
    ) {
      return `translations.${index}.${watchFieldName}`;
    }
  }

  return watchFieldName;
}

export interface SlugInputProps extends FormComponentProps {
  entityName: string;
  fieldName: string;
  watchFieldName: string;
  entityId?: string;
  defaultReadonly?: boolean;
  className?: string;
}

export function SlugInput({
  value,
  onChange,
  disabled,
  entityName,
  fieldName,
  watchFieldName,
  entityId,
  defaultReadonly = true,
  className,
  name,
  placeholder,
  ...props
}: SlugInputProps & { placeholder?: string }) {
  const form = useFormContext();
  const currentLanguageCode = useLocale();

  const [manualReadonly, setManualReadonly] = React.useState(defaultReadonly);
  const [loading, setLoading] = React.useState(false);

  const formReadonly = !disabled;
  const readonly = formReadonly || manualReadonly;

  const watchPath = resolveWatchFieldPath(
    name ?? "",
    watchFieldName,
    form.getValues(),
    currentLanguageCode,
  );

  const watchedValue = useWatch({
    control: form.control,
    name: watchPath,
  });

  const debouncedValue = useDebounce(watchedValue, 500);

  const fieldState = form.getFieldState(watchPath);

  const shouldAutoGenerate =
    readonly && !entityId && fieldState.isDirty && !!debouncedValue;

  React.useEffect(() => {
    if (!shouldAutoGenerate) {
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        setLoading(true);

        const slug = await generateSlug({
          entityName,
          fieldName,
          inputValue: debouncedValue,
          entityId,
        });

        if (!cancelled && slug !== value) {
          onChange?.(slug);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [
    shouldAutoGenerate,
    debouncedValue,
    entityName,
    fieldName,
    entityId,
    value,
    onChange,
  ]);

  async function regenerate() {
    if (!watchedValue) {
      return;
    }

    try {
      setLoading(true);

      const slug = await generateSlug({
        entityName,
        fieldName,
        inputValue: watchedValue,
        entityId,
      });

      onChange?.(slug);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={readonly}
          placeholder={
            readonly
              ? value
                ? "Slug is set"
                : (placeholder ?? "Slug will be generated automatically...")
              : "Enter slug manually"
          }
          className={cn(
            "pr-8",
            readonly && "bg-muted text-muted-foreground",
            loading && "text-muted-foreground",
            className,
          )}
          {...props}
        />

        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        )}
      </div>

      {!formReadonly && (
        <React.Fragment>
          {manualReadonly && value && (
            <Button
              type="button"
              variant="neutralNoShadow"
              size="icon"
              onClick={regenerate}
              disabled={!watchedValue || loading}
              title={"Regenerate slug"}
              aria-label={"Regenerate slug"}
            >
              <RefreshCwIcon />
            </Button>
          )}

          <Button
            type="button"
            variant="neutralNoShadow"
            size="icon"
            onClick={() => setManualReadonly((v) => !v)}
            title={manualReadonly ? "Edit manually" : "Generate automatically"}
            aria-label={
              manualReadonly ? "Edit manually" : "Generate automatically"
            }
          >
            {manualReadonly ? <EditIcon /> : <LockIcon />}
          </Button>
        </React.Fragment>
      )}
    </div>
  );
}
