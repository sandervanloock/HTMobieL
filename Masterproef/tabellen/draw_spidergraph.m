function [] = draw_spidergraph()

gemeenschap = csvread('populariteit.csv',7,2)
prod =  csvread('productiviteit.csv',3,2).^-1
prodfinal =  csvread('productiviteit.csv',2,2,[2 2 2 5]).^-1
gebruik = csvread('gebruik-matlab.csv',14,2)
ond = csvread('ondersteuning.csv',9,2)
perffinal = csvread('performantie.csv',3,2).^-1
%perffinal = csvread('performantie-final.csv',5,1).^-1

format long
%Minitial = cat(1,gemeenschap./max(gemeenschap),prod./max(prod),gebruik./max(gebruik),ond./max(ond),perf./max(perf));
Mfinal = cat(1,gemeenschap./max(gemeenschap),prodfinal./max(prodfinal),gebruik./max(gebruik),ond./max(ond),perffinal./max(perffinal));
%jqm,st,lungo,kendo => st,kendo,jqm,lungo
%swap kolom i met j:  A = A(:,[1:i-1,j,i+1:j-1,i,j+1:end])
%swap jqm(1) en st(2) => st,jqm,lungo,kendo
%Minitial = Minitial(:,[1:1-1,2,1+1:2-1,1,2+1:end]);
Mfinal = Mfinal(:,[1:1-1,2,1+1:2-1,1,2+1:end]);
%swap jqm(2) en kendo(4) => st,kendo,lungo,jqm
%Minitial = Minitial(:,[1:2-1,4,2+1:4-1,2,4+1:end]);
Mfinal = Mfinal(:,[1:2-1,4,2+1:4-1,2,4+1:end]);
%swap lungo(3) en jqm(4)
%Minitial = Minitial(:,[1:3-1,4,3+1:4-1,3,4+1:end])
Mfinal = Mfinal(:,[1:3-1,4,3+1:4-1,3,4+1:end])
%volgorde aanpassen:  Populariteit > Gebruik > Ondersteuning >
%Productiviteit > performantie
%Minitial([2 3],:) = Minitial([3 2],:);
%Minitial([2 5],:) = Minitial([5 2],:);
Mfinal([2 3],:) = Mfinal([3 2],:);
Mfinal([2 5],:) = Mfinal([5 2],:);

% figure; clf; set(gcf,'color','w'); s = zeros(1,4);
% s(1) = subplot(1,1,1);
% plot = spider(Minitial,'',[],{'Populariteit' ''; 'Performantie' ''; 'Productiviteit' '';'Ondersteuning' '';'Gebruik' ''},{'Sencha Touch' 'Kendo UI' 'jQuery Mobile' 'Lungo' },s(1));
% saveas(plot,'../figuren/spidergraph-initial.pdf');
% system('pdfcrop ../figuren/spidergraph-initial.pdf ../figuren/spidergraph-initial.pdf');


figure; clf; set(gcf,'color','w'); s = zeros(1,4);
s(1) = subplot(1,1,1);
plot = spider(Mfinal,'',[],{'Populariteit' ''; 'Performantie' ''; 'Productiviteit' '';'Ondersteuning' '';'Gebruik' ''},{'Sencha Touch' 'Kendo UI' 'jQuery Mobile' 'Lungo' },s(1));
saveas(plot,'../figuren/spidergraph-final-nl.pdf');
system('pdfcrop ../figuren/spidergraph-final-nl.pdf ../figuren/spidergraph-final-nl.pdf');

figure; clf; set(gcf,'color','w'); s = zeros(1,4);
s(1) = subplot(1,1,1);
plot = spider(Mfinal,'',[],{'Popularity' ''; 'Performance' ''; 'Productivity' '';'Support' '';'Usage' ''},{'Sencha Touch' 'Kendo UI' 'jQuery Mobile' 'Lungo' },s(1));
saveas(plot,'../figuren/spidergraph-final-en.pdf');
system('pdfcrop ../figuren/spidergraph-final-en.pdf ../figuren/spidergraph-final-en.pdf');