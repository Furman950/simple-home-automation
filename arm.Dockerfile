FROM mcr.microsoft.com/dotnet/core/aspnet:3.0 AS base
WORKDIR /app
EXPOSE 5585

FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS build
WORKDIR /src
COPY ["SimpleHomeAutomation/SimpleHomeAutomation.csproj", "SimpleHomeAutomation/"]
ENV ASPNETCORE_URLS=http://+:5585
RUN dotnet restore "SimpleHomeAutomation/SimpleHomeAutomation.csproj"
WORKDIR /src/testWebAppReact
COPY SimpleHomeAutomation .

RUN apt-get update -yq && apt-get upgrade -yq
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN npm install 

RUN dotnet build "SimpleHomeAutomation.csproj" -c Release -r linux-arm -o /app


FROM build AS publish
RUN dotnet publish "SimpleHomeAutomation.csproj" -c Release -r linux-arm -o /app

FROM base AS final
ENV ASPNETCORE_URLS=http://+:5585
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "SimpleHomeAutomation.dll"]