import { Form, Formik } from "formik";
import { InputField } from "../form/InputField";
import { object, string } from "yup";
import { useCallback } from "react";
import { update } from "immupdate";
import { noop } from "lodash";

interface Props {
  readonly initialValues: any;
  readonly setInitialValues: (value: any) => void;
  readonly index: number;
}

const validationSchema = object({
  info: string(),
});

export default function PiercingConnectorsForm({ initialValues, setInitialValues, index }: Props) {
  const onChangeCount = useCallback(
    (event: any) => {
      const piercingConnector = [...initialValues?.piercingConnector];

      piercingConnector[index].count = event?.target.value;

      setInitialValues((prev: any) =>
        update(prev, {
          piercingConnector,
        }),
      );
    },
    [setInitialValues, initialValues?.piercingConnector],
  );

  const onChangeInfo = useCallback(
    (event: any) => {
      const piercingConnector = [...initialValues?.piercingConnector];

      piercingConnector[index].info = event?.target.value;

      setInitialValues((prev: any) =>
        update(prev, {
          piercingConnector,
        }),
      );
    },
    [setInitialValues, initialValues?.piercingConnector],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={noop}
      validationSchema={validationSchema}
      enableReinitialize={true}
    >
      {() => (
        <Form>
          <div className="row">
            <div className="col-3">
              <InputField
                name="count"
                label="Soni"
                value={initialValues?.piercingConnector[index]?.count}
                onChange={onChangeCount}
              />
            </div>

            <div className="col-9">
              <InputField
                name="info"
                label="Qo'shimcha ma'lumot"
                onChange={onChangeInfo}
                value={initialValues?.piercingConnector[index]?.info}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
