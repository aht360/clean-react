import { RemoteAuthentication } from "@/data/usecases/authentication/remote-authentication";
import { makeAxiosHttpClient } from "../../http/axios-http-client-factory";
import { Authentication } from "@/domain/usecases";
import { makeApiUrl } from "../../http/api-url-factory";

export const makeRemoteAuthentication = (): Authentication => {
  return new RemoteAuthentication(
    makeApiUrl(),
    makeAxiosHttpClient()
  );
};
