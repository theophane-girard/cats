import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'app/environments/environment';

export const urlRequestInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const url = req.url.startsWith(environment.apiBaseUrl)
    ? req.url
    : environment.apiBaseUrl + req.url;
  const newReq = req.clone({ url });
  return next(newReq);
};
